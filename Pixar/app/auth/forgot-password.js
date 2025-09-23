// app/auth/ForgotPassword.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

import CustomInputField from "../../components/CustomInputField";
import SnackbarUtils from "../utils/SnackbarUtils";
import { HP, WP } from "../theme/scale";

// ✅ Firebase import
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
      SnackbarUtils.showInfo(" Password reset link sent to your email.");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err?.message || "Failed to send reset email");
      SnackbarUtils.showError(err?.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#000" }}
      contentContainerStyle={styles.container}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="light" />

      {/* --- Neon Top Glow --- */}
      <LinearGradient
        colors={["rgba(0,255,106,0.4)", "rgba(0,255,106,0.05)", "transparent"]}
        style={styles.neonGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* ✅ Logo (Bigger) */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={styles.logoWrapper}
      >
        <Image
          source={require("../../assets/images/H-removebg-preview.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={FadeInDown.delay(200).springify()}
        style={styles.title}
      >
        Forgot Password
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        entering={FadeInDown.delay(300).springify()}
        style={styles.subtitle}
      >
        Reset your password to access{" "}
        <Text style={{ color: "#00FF6A", fontWeight: "700" }}>Faith Frames</Text>
      </Animated.Text>

      {/* Email Input */}
      <Animated.View
        entering={FadeInDown.delay(400).springify()}
        style={{ width: "100%" }}
      >
        <CustomInputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          error={error}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          isMandatory
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.inputField}
        />
      </Animated.View>

      {/* Send Button */}
      <Animated.View
        entering={FadeInDown.delay(500).springify()}
        style={{ width: "100%" }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <LinearGradient
            colors={["#00FF6A", "#D4FF3F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButton}
          >
            <Text style={styles.sendText}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Loading Overlay */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00FF6A" />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: WP(6),
    paddingTop: HP(6),
    backgroundColor: "#000",
    alignItems: "center", // ✅ Center elements
  },
  neonGlow: {
    position: "absolute",
    top: -HP(10),
    width: WP(150),
    height: HP(50),
    borderRadius: WP(75),
    alignSelf: "center",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: HP(2),
  },
  logo: {
    width: WP(100), // ✅ Bigger
    height: HP(40), // ✅ Bigger
  },
  title: {
    fontSize: HP(3.5),
    color: "#fff",
    fontWeight: "700",
    marginBottom: HP(1),
    textAlign: "center",
  },
  subtitle: {
    fontSize: HP(2),
    color: "#f1eaea",
    marginBottom: HP(4),
    textAlign: "center",
    paddingHorizontal: WP(5),
  },
  inputField: {
    marginBottom: HP(2),
  },
  sendButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: HP(2),
  },
  sendText: {
    color: "#000",
    fontSize: HP(2.2),
    fontWeight: "700",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
});
