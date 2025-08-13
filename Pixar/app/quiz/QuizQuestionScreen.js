import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { quizData } from '../data/quizData';
import Icon from '../../components/Icon';
import { colors } from '../theme/colors';
import { fontSize, HP, WP } from '../theme/scale';
import SnackbarUtils from '../utils/SnackbarUtils';

const QuizQuestionScreen = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionPress = optionIndex => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === quizData.length - 1) {
      navigation.goBack();
      SnackbarUtils.showInfo(
        `Quiz completed! Marks: ${score}/${quizData.length}`,
        {
          score: score,
          totalQuestions: quizData.length,
        },
      );
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const getOptionStyle = index => {
    if (!isAnswered) {
      return styles.option;
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return [styles.option, styles.correctOption];
    }
    if (index === selectedOption) {
      return [styles.option, styles.incorrectOption];
    }
    return styles.option;
  };

  const getOptionIcon = index => {
    if (!isAnswered) {
      return <View style={styles.optionRadio} />;
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return <Icon name="check" size={fontSize(20)} color={colors.white} />;
    }
    if (index === selectedOption) {
      return <Icon name="close" size={fontSize(20)} color={colors.white} />;
    }
    return <View style={styles.optionRadio} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleOptionPress(index)}
              disabled={isAnswered}
            >
              {getOptionIcon(index)}
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isAnswered && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={{ width: WP(16) }} />
        <View style={styles.progressContainer}>
          {quizData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentQuestionIndex
                  ? styles.currentDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.nextArrow, { opacity: isAnswered ? 1 : 0.3 }]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Icon name="ArrowRightIcon" color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
  mainContent: { flex: 1, paddingTop: HP(6), paddingHorizontal: WP(5) },
  questionText: {
    fontSize: fontSize(28),
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: { marginVertical: HP(4) },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WP(2),
    padding: HP(2),
    marginVertical: HP(1),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: WP(8),
    backgroundColor: colors.secondary,
  },
  optionText: { color: colors.white, fontSize: fontSize(16) },
  optionRadio: {
    height: fontSize(20),
    width: fontSize(20),
    borderRadius: fontSize(10),
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  correctOption: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  incorrectOption: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  explanationBox: {
    backgroundColor: colors.primary + '10',
    padding: WP(4),
    borderRadius: WP(6),
  },
  explanationText: { color: colors.white, fontSize: fontSize(14) },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WP(5),
    paddingBottom: HP(2.5),
  },
  progressContainer: { flexDirection: 'row' },
  dot: {
    height: WP(4),
    width: WP(4),
    borderRadius: WP(4),
    marginHorizontal: WP(1),
  },
  currentDot: {
    backgroundColor: colors.primary,
    height: WP(4),
    width: WP(8),
    borderRadius: WP(4),
  },
  inactiveDot: { backgroundColor: colors.light },
  nextArrow: {
    backgroundColor: colors.primary,
    padding: HP(1.5),
    borderRadius: WP(8),
  },
});

export default QuizQuestionScreen;
