// app/auth/login.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { hp, wp } from "../../helpers/common";
import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import CustomInputField from "../../components/CustomInputField";
import ProgressOpacity from "../quiz/ProgressOpacity";
import { colors } from "../theme/colors";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Google Auth with expo-auth-session
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "<YOUR_EXPO_CLIENT_ID>.apps.googleusercontent.com",
    iosClientId: "<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    androidClientId: "<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
    webClientId: "<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            console.log("Google Login Success:", userCredential.user.email);
            Alert.alert("Success", "Logged in with Google!");
            router.push("/home");
          })
          .catch((error) => {
            console.error("Google Firebase login error:", error);
            Alert.alert("Login Failed", error.message);
          });
      }
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in:", userCredential.user.email);
      Alert.alert("Success", "Login successful!");
      router.push("/home");
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
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
        {/* Title */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(700).springify()}
          style={styles.heroTitle}
        >
          Faith Frames
        </Animated.Text>

        {/* Main White Card */}
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Animated.Text
              entering={FadeInDown.delay(300).duration(700).springify()}
              style={styles.subtitle}
            >
              Welcome Back
            </Animated.Text>

            {/* Email Input */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(700).springify()}
            >
              <CustomInputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                isMandatory
              />
            </Animated.View>

            {/* Password Input */}
            <Animated.View
              entering={FadeInDown.delay(500).duration(700).springify()}
            >
              <CustomInputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isMandatory
              />
              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Pressable>
            </Animated.View>

            {/* Login Button */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(700).springify()}
            >
              <ProgressOpacity
                title={loading ? "Logging in..." : "Log In"}
                loading={loading}
                disabled={loading}
                onPress={handleLogin}
                style={styles.loginBtn}
                textStyle={{ color: "white" }}
              />
            </Animated.View>

            {/* Google Login */}
            <Animated.View
              entering={FadeInDown.delay(650).duration(700).springify()}
              style={styles.googleBtnWrapper}
            >
              <Pressable
                style={styles.googleBtn}
                disabled={!request}
                onPress={() => promptAsync()}
              >
                <Image
                  source={require("../../assets/images/google-logo.png")}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleBtnText}>Sign in with Google</Text>
              </Pressable>
            </Animated.View>

            {/* Signup */}
            <Animated.View
              entering={FadeInDown.delay(700).duration(700).springify()}
              style={styles.signupWrapper}
            >
              <Text style={styles.signupText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push("/auth/register")}>
                <Text style={styles.signupLink}> Sign Up</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    marginTop: hp(20),
    paddingVertical: hp(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  innerContainer: {
    marginHorizontal: wp(6),
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: hp(10),
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: hp(3),
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: hp(1.7),
    color: "#666",
  },
  loginBtn: {
    marginTop: hp(2),
    backgroundColor: "black",
    borderRadius: wp(5),
    paddingVertical: hp(1.8),
    alignItems: "center",
  },
  signupWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  signupText: {
    fontSize: hp(1.8),
    color: "#555",
  },
  signupLink: {
    fontSize: hp(1.8),
    color: "black",
    fontWeight: "bold",
  },
  googleBtnWrapper: {
    marginTop: hp(2),
    alignItems: "center",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: wp(5),
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(6),
    borderWidth: 1,
    borderColor: "#ccc",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    color: "#000",
    fontSize: hp(2),
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
