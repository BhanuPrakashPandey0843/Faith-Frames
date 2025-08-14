// E:\2025\Freelance\Faith-Frames\Pixar\app\quiz
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from '../../components/Icon';
import { colors } from '../theme/colors';
import { fontSize, HP, WP } from '../theme/scale';
import TopBar from '../../components/TopBar';
import ProgressOpacity from './ProgressOpacity';
import CustomBottomsheet from '../../components/CustomBottomsheet'; // Add import
import { commonStyles } from '../utils/commonStyles';
import { ScreenConstants } from '../utils/constant';

const DifficultyButton = ({ icon, label, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.difficultyBtn,
      isSelected && { backgroundColor: colors.primary },
    ]}
    onPress={onPress}
  >
    <Icon name={icon} color={isSelected ? colors.white : colors.primary} />
    <Text
      style={[styles.difficultyBtnText, isSelected && { color: colors.white }]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const QuizScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');

  const handleStartQuiz = () => {
    setModalVisible(false);
    setDifficulty('Medium');
    navigation.navigate(ScreenConstants.QUIZ_QUESTION_SCREEN);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>Bible Quiz</Text>
        <Text style={styles.subtitle}>
          Test your knowledge and grow in wisdom
        </Text>

        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 99,
            padding: WP(4),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: HP(6),
          }}
        >
          <Icon name="BookOpenIcon" size={fontSize(80)} color={colors.white} />
        </View>

        <ProgressOpacity
          onPress={() => setModalVisible(true)}
          title="Start Quiz"
          style={styles.startButton}
          icon={'AcademicCapIcon'}
        />

        <Text style={styles.disclaimer}>
          Disclaimer: Quizzes are AI-generated and may display inaccurate
          information so double-check its responses.
        </Text>
      </View>

      {/* Replace Modal with CustomBottomsheet */}
      <CustomBottomsheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Choose Difficulty"
      >
        <View style={styles.difficultyContainer}>
          <DifficultyButton
            icon="RocketLaunchIcon"
            label="Easy"
            isSelected={difficulty === 'Easy'}
            onPress={() => setDifficulty('Easy')}
          />
          <DifficultyButton
            icon="BookOpenIcon"
            label="Medium"
            isSelected={difficulty === 'Medium'}
            onPress={() => setDifficulty('Medium')}
          />
          <DifficultyButton
            icon="AcademicCapIcon"
            label="Hard"
            isSelected={difficulty === 'Hard'}
            onPress={() => setDifficulty('Hard')}
          />
        </View>
        <ProgressOpacity
          onPress={handleStartQuiz}
          title="Next"
          style={[
            commonStyles.primaryBtnSmall,
            {
              backgroundColor: colors.primary,
            },
          ]}
          icon={'FireIcon'}
        />
      </CustomBottomsheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: HP(6),
    marginHorizontal: WP(5),
  },
  title: {
    fontSize: fontSize(40),
    fontWeight: 'bold',
    color: colors.white,
    marginTop: HP(2.5),
  },
  subtitle: {
    fontSize: fontSize(20),
    color: colors.light,
    marginTop: HP(1),
    textAlign: 'center',
    lineHeight: HP(4),
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '50',
    paddingVertical: HP(2),
    paddingHorizontal: WP(8),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 99,
    marginTop: HP(6),
  },
  startButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disclaimer: {
    position: 'absolute',
    bottom: 20,
    fontSize: fontSize(12),
    color: colors.light,
    textAlign: 'center',
    paddingHorizontal: WP(5),
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: HP(2),
  },
  difficultyBtn: {
    alignItems: 'center',
    padding: WP(4),
    borderRadius: WP(3),
    borderWidth: 1,
    borderColor: colors.primary,
    width: WP(25),
  },
  difficultyBtnText: {
    fontSize: fontSize(12),
    color: colors.primary,
    marginTop: 5,
  },
});

export default QuizScreen;
