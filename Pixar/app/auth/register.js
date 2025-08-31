// File: app/auth/register.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { hp, wp } from "../../helpers/common";
import { colors } from "../theme/colors";

// ✅ Firebase imports
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID_HERE.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      Alert.alert("Google Sign-In Success", JSON.stringify(authentication));
      router.push("/home");
    }
  }, [response]);

  // ✅ Handle Firebase Signup
  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: username });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        username,
        email,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!");
      router.push("/auth/login");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const evaluatePasswordStrength = (pass) => {
    let strength = "";
    if (pass.length < 6) strength = "Weak";
    else if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
      strength = "Strong";
    } else if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) {
      strength = "Medium";
    } else {
      strength = "Weak";
    }
    setPasswordStrength(strength);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="light" />
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

        {/* White Card */}
        <View style={styles.container}>
          <Animated.Text
            entering={FadeInDown.delay(300).duration(700).springify()}
            style={styles.subtitle}
          >
            Create your account
          </Animated.Text>

          {/* Username Input */}
          <Animated.View entering={FadeInDown.delay(400).duration(700).springify()}>
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor="#777"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </Animated.View>

          {/* Email Input */}
          <Animated.View entering={FadeInDown.delay(500).duration(700).springify()}>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#777"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </Animated.View>

          {/* Password Input */}
          <Animated.View entering={FadeInDown.delay(600).duration(700).springify()}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#777"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                evaluatePasswordStrength(text);
              }}
            />
            {password !== "" && (
              <Text
                style={{
                  fontSize: hp(1.6),
                  marginTop: 4,
                  color:
                    passwordStrength === "Strong"
                      ? "#2e7d32"
                      : passwordStrength === "Medium"
                      ? "#0c0b0b"
                      : "#e53935",
                }}
              >
                Password Strength: {passwordStrength}
              </Text>
            )}
          </Animated.View>

          {/* Signup Button */}
          <Animated.View entering={FadeInDown.delay(700).duration(700).springify()}>
            <Pressable
              onPress={handleSignup}
              style={[styles.signupButton, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              <Text style={styles.signupText}>
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Google Signup */}
          <Animated.View
            entering={FadeInDown.delay(800).duration(700).springify()}
            style={{ marginTop: hp(2) }}
          >
            <Pressable onPress={() => promptAsync()} style={styles.googleButton}>
              <Image
                source={require("../../assets/images/google-logo.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Sign up with Google</Text>
            </Pressable>
          </Animated.View>

          {/* Redirect to Login */}
          <Animated.View
            entering={FadeInDown.delay(900).duration(700).springify()}
            style={styles.loginRedirect}
          >
            <Text style={styles.redirectText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("/auth/login")}>
              <Text style={styles.redirectLink}> Log In</Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    marginTop: hp(16),
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff", // white on background
    textAlign: "center",
    marginTop: hp(10),
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: hp(3),
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: hp(2),
    marginBottom: hp(1.5),
  },
  signupButton: {
    backgroundColor: "#000", // Black button
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: hp(2),
  },
  signupText: {
    color: "#fff", // White text
    fontSize: hp(2.2),
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  googleIcon: { width: 18, height: 18 },
  googleText: {
    fontWeight: "600",
    color: "#333",
  },
  loginRedirect: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2),
    justifyContent: "center",
  },
  redirectText: {
    fontSize: hp(1.8),
    color: "#555",
  },
  redirectLink: {
    fontSize: hp(1.8),
    color: "#000", // black instead of yellow
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegisterScreen;
