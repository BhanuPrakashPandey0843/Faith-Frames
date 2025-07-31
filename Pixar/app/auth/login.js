import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with", email, password);
    router.push("home");
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google login...");
    // Implement Google auth with Firebase/Expo AuthSession/etc.
  };

  const handleForgotPassword = () => {
    // Optional: redirect to reset screen or external link
    console.log("Forgot password pressed");
    router.push("/auth/forgot-password"); // if you have that route
    // or use: Linking.openURL("https://yourdomain.com/forgot");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../../assets/images/3d-rendering-black-cross.jpg")}
        style={styles.bgImage}
        resizeMode="cover"
      />

      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 0.6)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.9 }}
        />

        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.delay(300).springify()}
            style={styles.title}
          >
            Faith Frames
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.subtitle}
          >
            Welcome Back
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={styles.inputWrapper}
          >
            <TextInput
              placeholder="Email"
              placeholderTextColor="#333"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#333"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>Log In</Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(700).springify()}
            style={{ width: wp(80) }}
          >
            <Pressable onPress={handleGoogleLogin} style={styles.googleButton}>
              <Image
                source={require("../../assets/images/google-logo.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            style={styles.signupWrapper}
          >
            <Text style={styles.signupText}>Don't have an account?</Text>
            <Pressable onPress={() => router.push("/auth/register")}>
              <Text style={styles.signupLink}> Sign Up</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
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
    height: hp(70),
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 40,
    gap: 14,
  },
  title: {
    fontSize: hp(6),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  subtitle: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    marginBottom: 10,
  },
  inputWrapper: {
    width: wp(80),
    gap: 12,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
    fontSize: hp(2),
    color: "#000",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: hp(1.7),
    color: "#666",
  },
  loginButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: 14,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loginText: {
    color: theme.colors.white,
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.medium,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  googleText: {
    fontWeight: "600",
    color: "#333",
  },
  signupWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  signupText: {
    fontSize: hp(1.8),
    color: "#555",
  },
  signupLink: {
    fontSize: hp(1.8),
    color: "#000",
    fontWeight: "bold",
  },
});

export default LoginScreen;
