// app/auth/Login.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image, // ✅ Added Image
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // ✅ Add AntDesign for Apple logo

import { hp, wp } from "../../helpers/common";
import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import CustomInputField from "../../components/CustomInputField";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Google Auth - Disabled until credentials are configured
  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId: "<YOUR_EXPO_CLIENT_ID>.apps.googleusercontent.com",
    // iosClientId: "<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    // androidClientId: "<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
    // webClientId: "<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        signInWithCredential(auth, credential)
          .then(() => {
            Alert.alert("Success", "Logged in with Google!");
            router.push("/home");
          })
          .catch((error) => {
            Alert.alert("Login Failed", error.message);
          });
      }
    }
  }, [response]);

  const handleGoogleLogin = () => {
    Alert.alert("Google Sign-In", "Google authentication is not configured. Please use email/password login.");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login successful!");
      router.push("/home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
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
          {/* Neon Top Glow */}
          <LinearGradient
            colors={[
              "rgba(0,255,106,0.4)",
              "rgba(0,255,106,0.05)",
              "transparent",
            ]}
            style={styles.neonGlow}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          
          {/* ✅ Logo */}
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
            Welcome Back
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            entering={FadeInDown.delay(300).springify()}
            style={styles.subtitle}
          >
            Login to access your faith-inspired content.
          </Animated.Text>

          {/* Email Input */}
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={{ width: "100%" }}
          >
            <CustomInputField
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              bgColor="#1a1a1a"
              borderColor="#333"
              style={{ marginBottom: hp(2) }}
            />
          </Animated.View>

          {/* Password Input */}
          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={{ width: "100%" }}
          >
            <CustomInputField
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              bgColor="#1a1a1a"
              borderColor="#333"
              style={{ marginBottom: hp(1) }}
            />
            <Pressable onPress={() => router.push("/auth/forgot-password")}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Pressable>
          </Animated.View>

          {/* Login Button */}
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            style={{ width: "100%" }}
          >
            <Pressable
              disabled={loading}
              onPress={handleLogin}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <LinearGradient
                colors={["#00FF6A", "#D4FF3F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.loginText}>Log In</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          {/* Google & Apple */}
          <View style={styles.oauthWrapper}>
            <Pressable style={styles.oauthBtn} onPress={handleGoogleLogin}>
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.oauthText}>Google</Text>
            </Pressable>
            <Pressable style={styles.oauthBtn} onPress={() => Alert.alert("Apple Sign-In", "Apple authentication coming soon.")}>
              <AntDesign name="apple1" size={20} color="#fff" /> 
              <Text style={styles.oauthText}>Apple</Text>
            </Pressable>
          </View>

          {/* Signup */}
          <View style={styles.signupWrapper}>
            <Text style={styles.signupText}>Don’t have an account?</Text>
            <Pressable onPress={() => router.push("/auth/register")}>
              <Text style={styles.signupLink}> Create an account</Text>
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
  logoWrapper: {
    alignItems: "center",
    marginBottom: hp(2), 
  },
  logo: {
    width: wp(100), 
    height: hp(35), 
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: 13,
    color: "#ccc",
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
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(3),
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
