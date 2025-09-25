// Pixar/app/quiz/index.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import Icon from "../../components/Icon";
import { fontSize, HP, WP } from "../theme/scale";
import TopBar from "../../components/TopBar";
import CustomBottomsheet from "../../components/CustomBottomsheet";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    primary: "#FFD700", // gold
    secondary: "#00FF87", // neon green
    glass: "rgba(255,255,255,0.1)",
  },
};

// Difficulty Button
const DifficultyButton = ({ icon, label, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isSelected]);

  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", theme.colors.secondary],
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
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
          isSelected && { backgroundColor: theme.colors.primary },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon
          name={icon}
          color={isSelected ? theme.colors.black : theme.colors.primary}
          size={fontSize(28)}
        />
        <Text
          style={[
            styles.difficultyBtnText,
            isSelected && { color: theme.colors.black },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
      {isSelected && (
        <Animated.View
          style={[
            styles.glowBorder,
            {
              shadowColor: glowShadow,
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

const QuizScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(iconAnim, { toValue: 1.1, useNativeDriver: true }),
        Animated.spring(iconAnim, { toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleStartQuiz = () => {
    setModalVisible(false);
    setDifficulty("Medium");
    setLoading(true);

    // Fake loading (looks like generating quiz)
    setTimeout(() => {
      setLoading(false);
      router.push("/quiz/QuizQuestionScreen");
    }, 2000);
  };

  return (
    <LinearGradient colors={["#001400", "#000"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={"#000"} />
      <TopBar />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Bible Quiz</Text>
        <LinearGradient
          colors={["#FFD700", "#00FF87"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.subtitleWrapper}
        >
          <Text style={styles.subtitle}>
            Test your knowledge and grow in wisdom
          </Text>
        </LinearGradient>

        {/* Animated Icon Circle */}
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: iconAnim }] }]}>
          <Icon name="BookOpenIcon" size={fontSize(70)} color={theme.colors.primary} />
        </Animated.View>

        {/* Start Button */}
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.startButton}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.disclaimer}>
          Disclaimer: Quizzes are AI-generated and may display inaccurate information.
        </Text>
      </Animated.View>

      {/* Difficulty Modal */}
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

        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.nextBtn}>
          <TouchableOpacity onPress={handleStartQuiz}>
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </LinearGradient>
      </CustomBottomsheet>

      {/* Loader Overlay */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <Animated.View style={styles.loaderCircle}>
            <Icon name="BookOpenIcon" size={fontSize(50)} color={theme.colors.primary} />
          </Animated.View>
          <Text style={styles.loaderText}>Preparing your quiz...</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: HP(6),
    marginHorizontal: WP(5),
  },
  title: {
    fontSize: fontSize(40),
    fontWeight: "800",
    color: theme.colors.white,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitleWrapper: {
    marginTop: HP(1.5),
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: fontSize(16),
    color: theme.colors.black,
    textAlign: "center",
    fontWeight: "600",
  },
  iconCircle: {
    marginTop: HP(6),
    padding: WP(8),
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  startButton: {
    marginTop: HP(6),
    borderRadius: 99,
    paddingVertical: HP(2.4),
    paddingHorizontal: WP(12),
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  startButtonText: {
    fontSize: fontSize(20),
    fontWeight: "700",
    color: theme.colors.black,
  },
  disclaimer: {
    position: "absolute",
    bottom: 20,
    fontSize: fontSize(12),
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    paddingHorizontal: WP(5),
    fontStyle: "italic",
  },
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: HP(2),
  },
  difficultyBtn: {
    alignItems: "center",
    paddingVertical: HP(2),
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    width: WP(25),
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  difficultyBtnText: {
    fontSize: fontSize(14),
    color: theme.colors.white,
    marginTop: 6,
    fontWeight: "600",
  },
  glowBorder: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: 16,
    shadowRadius: 12,
  },
  nextBtn: {
    marginTop: HP(2),
    borderRadius: 99,
    paddingVertical: HP(2),
    alignItems: "center",
  },
  nextBtnText: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: theme.colors.black,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderCircle: {
    padding: WP(6),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: HP(2),
  },
  loaderText: {
    color: theme.colors.white,
    fontSize: fontSize(16),
    fontWeight: "600",
  },
});

export default QuizScreen;
