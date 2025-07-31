// Faith-Frames\Pixar\app\auth\forgot-password.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Simulate password reset logic (API call can go here)
    Alert.alert("Success", "Password reset link sent to your email.");
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={require("../../assets/images/3d-rendering-black-cross.jpg")}
        style={styles.bgImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.6)",
          "white",
          "white",
        ]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.contentContainer}>
        <Animated.Text entering={FadeInDown.springify()} style={styles.title}>
          Forgot Password
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200).springify()}
          style={styles.subtitle}
        >
          Enter your email to receive a reset link.
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.inputWrapper}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor="#333"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Pressable onPress={handleResetPassword} style={styles.resetButton}>
            <Text style={styles.resetText}>Send Reset Link</Text>
          </Pressable>
        </Animated.View>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    top: -hp(5),
  },
  gradient: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 60,
    gap: 18,
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.neutral(0.9),
  },
  subtitle: {
    fontSize: hp(1.9),
    color: "#555",
    textAlign: "center",
    marginHorizontal: 30,
  },
  inputWrapper: {
    width: wp(80),
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
    fontSize: hp(2),
    color: "#000",
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  resetText: {
    color: theme.colors.white,
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.medium,
  },
  backLink: {
    marginTop: 16,
    color: "#333",
    fontSize: hp(1.8),
    textDecorationLine: "underline",
  },
});

export default ForgotPassword;
