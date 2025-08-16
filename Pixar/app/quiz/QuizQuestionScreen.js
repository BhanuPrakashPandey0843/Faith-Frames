// app/quiz/QuizQuestionScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router'; // ✅ add
import { quizData } from '../data/quizData';
import Icon from '../../components/Icon';
import { fontSize, HP, WP } from '../theme/scale';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const QuizQuestionScreen = () => { // ❗️don’t rely on navigation prop
  const router = useRouter();                 // ✅
  const navigation = useNavigation();         // ✅

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !isAnswered) setIsAnswered(true);
  }, [timeLeft, isAnswered]);

  const handleOptionPress = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === currentQuestion.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleNext = () => {
    if (currentQuestionIndex === quizData.length - 1) {
      // ✅ expo-router navigation with params
      router.replace({
        pathname: '/quiz/ThanksScreen',
        params: { score: String(score), total: String(quizData.length) },
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
    if (index === currentQuestion.correctAnswerIndex) return [styles.option, styles.correctOption];
    if (index === selectedOption) return [styles.option, styles.incorrectOption];
    return styles.option;
  };

  const getOptionIcon = (index) => {
    if (!isAnswered) return <View style={styles.optionRadio} />;
    if (index === currentQuestion.correctAnswerIndex) return <Icon name="check" size={fontSize(18)} color="#fff" />;
    if (index === selectedOption) return <Icon name="close" size={fontSize(18)} color="#fff" />;
    return <View style={styles.optionRadio} />;
  };

  return (
    <LinearGradient colors={['#0f0f0f', '#1c1c1c']} style={styles.container}>
      {/* 🔙 Back Button with safe fallback */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation?.canGoBack?.()) navigation.goBack();
          else router.replace('/home/index');
        }}
      >
        <Icon name="ArrowLeftIcon" color="#fff" size={22} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Timer */}
        <View style={styles.timerWrapper}>
          <Animated.View style={styles.timerCircle}>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </Animated.View>
        </View>

        {/* Question */}
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} / {quizData.length}
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
              onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start()}
            >
              <BlurView intensity={40} tint="dark" style={styles.blurBox}>
                {getOptionIcon(index)}
                <Text style={styles.optionText}>{option}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {isAnswered && (
          <Animated.View style={[styles.explanationBox, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.progressContainer}>
          {quizData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentQuestionIndex ? styles.currentDot : styles.inactiveDot]}
            />
          ))}
        </View>
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
  mainContent: { flex: 1, paddingTop: HP(4), paddingHorizontal: WP(5) },
  backButton: {
    position: 'absolute',
    top: HP(4),
    left: WP(4),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: HP(1.2),
    borderRadius: WP(6),
  },
  timerWrapper: { alignItems: 'center', marginBottom: HP(2) },
  timerCircle: {
    height: WP(18),
    width: WP(18),
    borderRadius: WP(9),
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  timerText: { color: '#fff', fontSize: fontSize(20), fontWeight: 'bold' },
  questionCounter: { color: '#bbb', fontSize: fontSize(14), textAlign: 'center', marginBottom: HP(1) },
  questionText: { fontSize: fontSize(24), color: '#fff', fontWeight: '600', textAlign: 'center', marginVertical: HP(2) },
  optionsContainer: { marginVertical: HP(3) },
  option: {
    marginVertical: HP(1.5),
    borderRadius: WP(8),
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  blurBox: { flexDirection: 'row', alignItems: 'center', gap: WP(2), padding: HP(2) },
  optionText: { color: '#fff', fontSize: fontSize(16), flex: 1 },
  optionRadio: { height: fontSize(18), width: fontSize(18), borderRadius: fontSize(9), borderWidth: 2, borderColor: '#777' },
  correctOption: { backgroundColor: '#1DB954cc' },
  incorrectOption: { backgroundColor: '#E02424cc' },
  explanationBox: { backgroundColor: '#1a1a1a', padding: WP(4), borderRadius: WP(6), marginTop: HP(2) },
  explanationText: { color: '#ddd', fontSize: fontSize(14), textAlign: 'center', lineHeight: 20 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: WP(5), paddingBottom: HP(2.5) },
  progressContainer: { flexDirection: 'row' },
  dot: { height: WP(4), width: WP(4), borderRadius: WP(4), marginHorizontal: WP(1) },
  currentDot: { backgroundColor: '#fff', height: WP(4), width: WP(8), borderRadius: WP(4), shadowColor: '#fff', shadowOpacity: 0.8, shadowRadius: 8 },
  inactiveDot: { backgroundColor: '#444' },
  nextArrow: { backgroundColor: '#fff', padding: HP(1.5), borderRadius: WP(8) },
});

export default QuizQuestionScreen;
