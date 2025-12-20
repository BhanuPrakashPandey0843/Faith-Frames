// app/auth/register.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import { hp, wp } from "../../helpers/common";
import { auth, db } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import CustomInputField from "../../components/CustomInputField";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Auth - Disabled until credentials are configured
  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId: "<YOUR_EXPO_CLIENT_ID>.apps.googleusercontent.com",
    // iosClientId: "<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    // androidClientId: "<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
    // webClientId: "<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      Alert.alert("Google Sign-In Success", "Logged in via Google");
      router.replace("/home");
    }
  }, [response]);

  const handleGoogleSignup = () => {
    Alert.alert("Google Sign-In", "Google authentication is not configured. Please use email/password signup.");
  };

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

      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const evaluatePasswordStrength = (pass) => {
    let strength = "";
    if (pass.length < 6) strength = "Weak";
    else if (
      /[A-Z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    ) strength = "Strong";
    else if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) strength = "Medium";
    else strength = "Weak";
    setPasswordStrength(strength);
  };

  return (
    <LinearGradient colors={["#001400", "#000"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* Neon Glow */}
          <LinearGradient
            colors={["rgba(0,255,106,0.4)", "rgba(0,255,106,0.05)", "transparent"]}
            style={styles.neonGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/H-removebg-preview.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title */}
          <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.title}>
            Create Account
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.subtitle}>
            Sign up to access your faith-inspired content
          </Animated.Text>

          {/* Username */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={{ width: "100%" }}>
            <CustomInputField
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              bgColor="#1a1a1a"
              borderColor="#333"
              style={{ marginBottom: hp(2) }}
            />
          </Animated.View>

          {/* Email */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={{ width: "100%" }}>
            <CustomInputField
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              bgColor="#1a1a1a"
              borderColor="#333"
              style={{ marginBottom: hp(2) }}
            />
          </Animated.View>

          {/* Password */}
          <Animated.View entering={FadeInDown.delay(600).springify()} style={{ width: "100%" }}>
            <CustomInputField
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                evaluatePasswordStrength(text);
              }}
              secureTextEntry={!showPassword}
              bgColor="#1a1a1a"
              borderColor="#333"
              style={{ marginBottom: hp(1) }}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#ccc" />
                </Pressable>
              }
            />
            {password !== "" && (
              <Text
                style={[
                  styles.strengthText,
                  passwordStrength === "Strong"
                    ? { color: "#00FF6A" }
                    : passwordStrength === "Medium"
                    ? { color: "#FFD700" }
                    : { color: "#e53935" },
                ]}
              >
                Password Strength: {passwordStrength}
              </Text>
            )}
          </Animated.View>

          {/* Sign Up Button */}
          <Animated.View entering={FadeInDown.delay(700).springify()} style={{ width: "100%" }}>
            <Pressable
              onPress={handleSignup}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              disabled={loading}
            >
              <LinearGradient
                colors={["#00FF6A", "#D4FF3F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtn}
              >
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginText}>Sign Up</Text>}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          {/* Google OAuth */}
          <View style={styles.oauthWrapper}>
            <Pressable style={styles.oauthBtn} onPress={handleGoogleSignup}>
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.oauthText}>Google</Text>
            </Pressable>
            <Pressable style={styles.oauthBtn} onPress={() => Alert.alert("Apple Sign-In", "Apple authentication coming soon.")}>
              <AntDesign name="apple1" size={20} color="#fff" />
              <Text style={styles.oauthText}>Apple</Text>
            </Pressable>
          </View>

          {/* Redirect to Login */}
          <View style={styles.signupWrapper}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("/auth/login")}>
              <Text style={styles.signupLink}> Log In</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp(6),
    justifyContent: "center",
    alignItems: "center",
  },
  neonGlow: {
    position: "absolute",
    top: -hp(10),
    width: wp(150),
    height: hp(60),
    borderRadius: wp(75),
    alignSelf: "center",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: hp(2),
  },
  logo: {
    width: wp(100),
    height: hp(26),
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: 15,
    color: "#ccc",
    textAlign: "center",
    marginBottom: hp(4),
  },
  loginBtn: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  loginText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  strengthText: {
    fontSize: 13,
    marginTop: 4,
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(3),
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#777",
    marginHorizontal: 10,
    fontSize: 13,
  },
  oauthWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: hp(2),
  },
  oauthBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  oauthText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
  signupWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(2),
  },
  signupText: {
    color: "#aaa",
    fontSize: 14,
  },
  signupLink: {
    color: "#00FF6A",
    fontSize: 14,
    fontWeight: "700",
  },
});
