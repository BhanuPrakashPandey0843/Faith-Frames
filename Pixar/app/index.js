import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background image (subtle cross) */}
      <Image
        source={require("../assets/images/H-removebg-preview.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* Neon Glow at the Top */}
      <LinearGradient
        colors={[
          "rgba(0, 255, 106, 0.35)", // bright green glow
          "rgba(0, 0, 0, 0)",        // fade into transparent
        ]}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Black overlay for bottom */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",   // transparent top (let glow show)
          "rgba(0,0,0,1)",   // pure black bottom
        ]}
        style={styles.blackBottom}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Content */}
      <View style={styles.contentContainer}>
        <Animated.Text
          entering={FadeInDown.delay(400).springify()}
          style={styles.title}
        >
          Faith Frames
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(500).springify()}
          style={styles.punchline}
        >
          Faith on Your Screen. Peace in Your Heart.
        </Animated.Text>

        {/* Gradient Button */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Pressable onPress={() => router.push("/auth/login")}>
            <LinearGradient
              colors={["#00FF6A", "#D4FF3F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <Text style={styles.startText}>Explore</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // ensure base is black
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    opacity: 0.18, // subtle cross
  },
  topGlow: {
    width: wp(100),
    height: hp(50), // glow only covers top half
    position: "absolute",
    top: 0,
    left: 0,
  },
  blackBottom: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
    paddingBottom: 60,
  },
  title: {
    fontSize: hp(7),
    color: "#FFFFFF",
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
  },
  punchline: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 20,
    fontWeight: theme.fontWeights.medium,
    color: "#B3B3B3",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    shadowColor: "#00FF6A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  startText: {
    color: "#0A0F0B",
    fontSize: hp(3),
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 1,
    textAlign: "center",
  },
});

export default WelcomeScreen;
