// app/auth/forgot-password.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown } from "react-native-reanimated";

import CustomInputField from "../../components/CustomInputField";
import ProgressOpacity from "../quiz/ProgressOpacity";
import { commonStyles } from "../utils/commonStyles";
import SnackbarUtils from "../utils/SnackbarUtils";
import { colors } from "../theme/colors";
import { HP, WP } from "../theme/scale";

//  Firebase
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      SnackbarUtils.showInfo("Password reset link sent to your email.");
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
      style={{ flex: 1, backgroundColor: colors.white }}
      extraScrollHeight={20}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{
          uri: "https://www.pixelstalk.net/wp-content/uploads/2016/05/Best-Black-Wallpapers.png",
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Title on Background Image */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(700).springify()}
          style={styles.heroTitle}
        >
          Faith Frames
        </Animated.Text>

        {/* Main White Card */}
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            {/* Subtitle */}
            <Animated.Text
              entering={FadeInDown.delay(100).duration(700).springify()}
              style={styles.subtitle}
            >
              Enter your registered email to reset your password.
            </Animated.Text>

            {/* Email Input */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(700).springify()}
            >
              <CustomInputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                error={error}
                onChangeText={(text) => setEmail(text)}
                isMandatory
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>

            {/* Submit Button */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(700).springify()}
            >
              <ProgressOpacity
                title={isSubmitting ? "Sending..." : "Send Reset Link"}
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={handleSubmit}
                style={commonStyles.primaryBtn}
              />
            </Animated.View>

            {/* Success Message */}
            {success && (
              <Animated.Text
                entering={FadeInDown.delay(900).duration(700).springify()}
                style={styles.successMsg}
              >
                Check your inbox for password reset instructions.
              </Animated.Text>
            )}
          </View>
        </View>

        {/* Loading Overlay */}
        {isSubmitting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    marginTop: HP(8),
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopLeftRadius: WP(10),
    borderTopRightRadius: WP(10),
    marginTop: HP(20),
    paddingVertical: HP(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  innerContainer: {
    marginHorizontal: WP(6),
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray,
    textAlign: "center",
    marginBottom: HP(2),
    lineHeight: 22,
    fontWeight: "400",
  },
  successMsg: {
    marginTop: HP(2),
    color: colors.success || "green",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: "rgba(0,200,100,0.08)",
    paddingVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
