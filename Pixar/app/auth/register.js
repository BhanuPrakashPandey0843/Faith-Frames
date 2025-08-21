// File: app/auth/register.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { hp, wp } from "../../helpers/common";

// ✅ Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyADSJhSL-mUkh_HsHr6r0InrPxoxMo7QPU",
  authDomain: "wallpaper-c74a3.firebaseapp.com",
  projectId: "wallpaper-c74a3",
  storageBucket: "wallpaper-c74a3.appspot.com",
  messagingSenderId: "704605252889",
  appId: "1:704605252889:web:fd7d4f666da70d2aeda988",
  measurementId: "G-CL5K9HN0NL",
};

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

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
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.push("/auth/login"); // redirect to login after signup
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  const evaluatePasswordStrength = (pass) => {
    let strength = "";
    if (pass.length < 6) strength = "Weak";
    else if (
      /[A-Z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    ) {
      strength = "Strong";
    } else if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) {
      strength = "Medium";
    } else {
      strength = "Weak";
    }
    setPasswordStrength(strength);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../../assets/images/3d-rendering-black-cross.jpg")}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.contentContainer}
      >
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
          Create your account
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.inputWrapper}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
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
                fontSize: hp(1.7),
                marginTop: -4,
                color:
                  passwordStrength === "Strong"
                    ? "#2e7d32"
                    : passwordStrength === "Medium"
                    ? "#ff9800"
                    : "#e53935",
              }}
            >
              Password Strength: {passwordStrength}
            </Text>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.buttonGroup}
        >
          <Pressable onPress={handleSignup} style={styles.signupButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          <Pressable onPress={() => promptAsync()} style={styles.googleButton}>
            <Image
              source={require("../../assets/images/google-logo.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Sign up with Google</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={styles.loginRedirect}
        >
          <Text style={styles.redirectText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text style={styles.redirectLink}> Log In</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    width: wp(100),
    height: hp(100),
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: hp(5),
    paddingHorizontal: wp(10),
  },
  title: {
    fontSize: hp(5),
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: hp(2),
    color: "#333",
    marginBottom: 12,
  },
  inputWrapper: {
    width: "100%",
    gap: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: hp(1.9),
    color: "#000",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  buttonGroup: {
    gap: 16,
    width: "100%",
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: hp(2.2),
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    gap: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleText: {
    fontSize: hp(2),
    fontWeight: "500",
    color: "#444",
  },
  loginRedirect: {
    flexDirection: "row",
    marginTop: 20,
  },
  redirectText: {
    fontSize: hp(1.8),
    color: "#666",
  },
  redirectLink: {
    fontSize: hp(1.8),
    fontWeight: "600",
    color: "#000",
  },
});

export default RegisterScreen;
