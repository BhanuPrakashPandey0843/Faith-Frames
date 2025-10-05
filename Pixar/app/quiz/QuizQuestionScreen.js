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

const theme = {
  colors: {
    backgroundGradient: ["#001400", "#000000"],
    gold: "#FFD700",
    neonGreen: "#00FF87",
    red: "#FF4C4C",
    white: "#FFFFFF",
    glass: "rgba(255,255,255,0.08)",
  },
};

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

        fetched = fetched.sort(() => Math.random() - 0.5).slice(0, 20);
        setQuestions(fetched);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

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
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          lastScore: score,
          lastPlayed: new Date(),
        });
      } catch (e) {
        console.error("Error saving score", e);
      }

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
      return <Icon name="check" size={fontSize(18)} color={theme.colors.white} />;
    if (index === selectedOption)
      return <Icon name="close" size={fontSize(18)} color={theme.colors.white} />;
    return <View style={styles.optionRadio} />;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation?.canGoBack?.()) navigation.goBack();
          else router.replace("/home/index");
        }}
      >
        <Icon name="ArrowLeftIcon" color={theme.colors.white} size={22} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: HP(6),
          paddingHorizontal: WP(6),
          paddingBottom: HP(12),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Timer */}
        <LinearGradient colors={[theme.colors.gold, theme.colors.neonGreen]} style={styles.timerCircle}>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </LinearGradient>

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
                intensity={60}
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
        <LinearGradient
          colors={[theme.colors.gold, theme.colors.neonGreen]}
          style={styles.nextArrow}
        >
          <TouchableOpacity
            onPress={handleNext}
            disabled={!isAnswered}
            style={{ opacity: isAnswered ? 1 : 0.4 }}
          >
            <Icon name="ArrowRightIcon" color={theme.colors.black} strokeWidth={2} />
          </TouchableOpacity>
        </LinearGradient>
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
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: HP(1.2),
    borderRadius: WP(6),
  },
  timerCircle: {
    height: WP(18),
    width: WP(18),
    borderRadius: WP(9),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: HP(2),
  },
  timerText: {
    color: "#000",
    fontSize: fontSize(22),
    fontWeight: "bold",
  },
  questionCounter: {
    color: "#FFD700",
    fontSize: fontSize(16),
    textAlign: "center",
    marginBottom: HP(1),
    fontWeight: "600",
  },
  questionText: {
    fontSize: fontSize(24),
    color: theme.colors.white,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: HP(2),
    lineHeight: 30,
  },
  optionsContainer: { marginVertical: HP(3) },
  option: {
    marginVertical: HP(1.5),
    borderRadius: WP(8),
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  optionText: {
    color: theme.colors.white,
    fontSize: fontSize(16),
    flex: 1,
    marginLeft: WP(2),
  },
  optionRadio: {
    height: fontSize(18),
    width: fontSize(18),
    borderRadius: fontSize(9),
    borderWidth: 2,
    borderColor: "#777",
  },
  correctOption: { backgroundColor: "#00FF87cc" },
  incorrectOption: { backgroundColor: "#FF4C4Ccc" },
  explanationText: {
    color: "#FFD700",
    fontSize: fontSize(14),
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: HP(2.5),
  },
  nextArrow: {
    padding: HP(1.5),
    borderRadius: WP(10),
    shadowColor: "#FFD700",
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
});

export default QuizQuestionScreen;
