import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from "react-native";
import Icon from "../../components/Icon";
import { fontSize, HP, WP } from "../theme/scale";
import TopBar from "../../components/TopBar";
import ProgressOpacity from "./ProgressOpacity";
import CustomBottomsheet from "../../components/CustomBottomsheet";
import { commonStyles } from "../utils/commonStyles";
import { useRouter } from "expo-router"; // ✅ import router

const colorsBW = {
  black: "#000",
  white: "#fff",
};

const DifficultyButton = ({ icon, label, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => onPress());
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.difficultyBtn,
          isSelected && { backgroundColor: colorsBW.black },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon
          name={icon}
          color={isSelected ? colorsBW.white : colorsBW.black}
        />
        <Text
          style={[
            styles.difficultyBtnText,
            isSelected && { color: colorsBW.white },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuizScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter(); // ✅ use router

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartQuiz = () => {
    setModalVisible(false);
    setDifficulty("Medium");
    // ✅ Navigate to the quiz question screen
    router.push("/quiz/QuizQuestionScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colorsBW.black} />
      <TopBar />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Bible Quiz</Text>
        <Text style={styles.subtitle}>
          Test your knowledge and grow in wisdom
        </Text>

        <View style={styles.iconCircle}>
          <Icon name="BookOpenIcon" size={fontSize(80)} color={colorsBW.white} />
        </View>

        <ProgressOpacity
          onPress={() => setModalVisible(true)}
          title="Start Quiz"
          style={styles.startButton}
          icon={"AcademicCapIcon"}
        />

        <Text style={styles.disclaimer}>
          Disclaimer: Quizzes are AI-generated and may display inaccurate
          information so double-check its responses.
        </Text>
      </Animated.View>

      <CustomBottomsheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Choose Difficulty"
      >
        <View style={styles.difficultyContainer}>
          <DifficultyButton
            icon="RocketLaunchIcon"
            label="Easy"
            isSelected={difficulty === "Easy"}
            onPress={() => setDifficulty("Easy")}
          />
          <DifficultyButton
            icon="BookOpenIcon"
            label="Medium"
            isSelected={difficulty === "Medium"}
            onPress={() => setDifficulty("Medium")}
          />
          <DifficultyButton
            icon="AcademicCapIcon"
            label="Hard"
            isSelected={difficulty === "Hard"}
            onPress={() => setDifficulty("Hard")}
          />
        </View>
        <ProgressOpacity
          onPress={handleStartQuiz}
          title="Next"
          style={[
            commonStyles.primaryBtnSmall,
            { backgroundColor: colorsBW.black },
          ]}
          icon={"FireIcon"}
        />
      </CustomBottomsheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colorsBW.black },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: HP(6),
    marginHorizontal: WP(5),
  },
  title: {
    fontSize: fontSize(40),
    fontWeight: "bold",
    color: colorsBW.white,
    marginTop: HP(2.5),
  },
  subtitle: {
    fontSize: fontSize(20),
    color: colorsBW.white,
    marginTop: HP(1),
    textAlign: "center",
    lineHeight: HP(4),
  },
  iconCircle: {
    backgroundColor: colorsBW.black,
    borderRadius: 99,
    padding: WP(4),
    alignItems: "center",
    justifyContent: "center",
    marginTop: HP(6),
    borderWidth: 2,
    borderColor: colorsBW.white,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#fff2",
    paddingVertical: HP(2),
    paddingHorizontal: WP(8),
    borderWidth: 1,
    borderColor: colorsBW.white,
    borderRadius: 99,
    marginTop: HP(6),
  },
  disclaimer: {
    position: "absolute",
    bottom: 20,
    fontSize: fontSize(12),
    color: colorsBW.white,
    textAlign: "center",
    paddingHorizontal: WP(5),
  },
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: HP(2),
  },
  difficultyBtn: {
    alignItems: "center",
    padding: WP(4),
    borderRadius: WP(3),
    borderWidth: 1,
    borderColor: colorsBW.black,
    width: WP(25),
    backgroundColor: colorsBW.white,
  },
  difficultyBtnText: {
    fontSize: fontSize(12),
    color: colorsBW.black,
    marginTop: 5,
  },
});

export default QuizScreen;
