// app/quiz/QuizQuestionScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import Icon from "../../components/Icon";
import { fontSize, HP, WP } from "../theme/scale";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { db, auth } from "../../config/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const QuizQuestionScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔹 Fetch 20 random questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "questions"));
        let fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            question: data.question,
            options: data.options,
            correctAnswerIndex: data.options.indexOf(data.correctAnswer),
            explanation: data.explanation,
          };
        });

        // shuffle and slice 20
        fetched = fetched.sort(() => Math.random() - 0.5).slice(0, 20);

        setQuestions(fetched);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuestions();
  }, []);

  // 🔹 Countdown timer
  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !isAnswered) setIsAnswered(true);
  }, [timeLeft, isAnswered]);

  const handleOptionPress = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore((s) => s + 1);
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      // Save score in Firestore
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          lastScore: score,
          lastPlayed: new Date(),
        });
      } catch (e) {
        console.error("Error saving score", e);
      }

      // go to Thank You screen
      router.replace({
        pathname: "/quiz/ThanksScreen",
        params: { score: String(score), total: String(questions.length) },
      });
    } else {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
      fadeAnim.setValue(0);
    }
  };

  const getOptionStyle = (index) => {
    if (!isAnswered) return styles.option;
    if (index === questions[currentQuestionIndex].correctAnswerIndex)
      return [styles.option, styles.correctOption];
    if (index === selectedOption) return [styles.option, styles.incorrectOption];
    return styles.option;
  };

  const getOptionIcon = (index) => {
    if (!isAnswered) return <View style={styles.optionRadio} />;
    if (index === questions[currentQuestionIndex].correctAnswerIndex)
      return <Icon name="check" size={fontSize(18)} color="#fff" />;
    if (index === selectedOption)
      return <Icon name="close" size={fontSize(18)} color="#fff" />;
    return <View style={styles.optionRadio} />;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFB84C" />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <LinearGradient colors={["#0f0f0f", "#1c1c1c"]} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation?.canGoBack?.()) navigation.goBack();
          else router.replace("/home/index");
        }}
      >
        <Icon name="ArrowLeftIcon" color="#fff" size={22} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: HP(4),
          paddingHorizontal: WP(5),
          paddingBottom: HP(12),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Timer */}
        <View style={styles.timerWrapper}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>
        </View>

        {/* Question */}
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} / {questions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleOptionPress(index)}
              disabled={isAnswered}
              activeOpacity={0.85}
            >
              <BlurView
                intensity={40}
                tint="dark"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: HP(2),
                  borderRadius: WP(6),
                }}
              >
                {getOptionIcon(index)}
                <Text style={styles.optionText}>{option}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {isAnswered && (
          <Animated.View style={{ opacity: fadeAnim, marginTop: HP(2) }}>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation}
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
       
        <TouchableOpacity
          style={[styles.nextArrow, { opacity: isAnswered ? 1 : 0.3 }]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Icon name="ArrowRightIcon" color="#000" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: HP(4),
    left: WP(4),
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: HP(1.2),
    borderRadius: WP(6),
  },
  timerWrapper: { alignItems: "center", marginBottom: HP(2) },
  timerCircle: {
    height: WP(18),
    width: WP(18),
    borderRadius: WP(9),
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  timerText: {
    color: "#fff",
    fontSize: fontSize(20),
    fontWeight: "bold",
  },
  questionCounter: {
    color: "#bbb",
    fontSize: fontSize(14),
    textAlign: "center",
    marginBottom: HP(1),
  },
  questionText: {
    fontSize: fontSize(24),
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: HP(2),
  },
  optionsContainer: { marginVertical: HP(3) },
  option: {
    marginVertical: HP(1.5),
    borderRadius: WP(8),
    overflow: "hidden",
    shadowColor: "#fff",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  optionText: { color: "#fff", fontSize: fontSize(16), flex: 1 },
  optionRadio: {
    height: fontSize(18),
    width: fontSize(18),
    borderRadius: fontSize(9),
    borderWidth: 2,
    borderColor: "#777",
  },
  correctOption: { backgroundColor: "#1DB954cc" },
  incorrectOption: { backgroundColor: "#E02424cc" },
  explanationText: {
    color: "#ddd",
    fontSize: fontSize(14),
    textAlign: "center",
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: WP(5),
    paddingBottom: HP(2.5),
  },
  progressContainer: { flexDirection: "row" },
  dot: {
    height: WP(4),
    width: WP(4),
    borderRadius: WP(4),
    marginHorizontal: WP(1),
  },
  currentDot: {
    backgroundColor: "#fff",
    height: WP(4),
    width: WP(8),
    borderRadius: WP(4),
    shadowColor: "#fff",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  inactiveDot: { backgroundColor: "#444" },
  nextArrow: { backgroundColor: "#fff", padding: HP(1.5), borderRadius: WP(8) },
});

export default QuizQuestionScreen;
