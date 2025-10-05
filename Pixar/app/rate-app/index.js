// app/rate-app/index.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Icon from "../../components/Icon";
import { HP, WP, fontSize } from "../theme/scale";
import emailjs from "emailjs-com";

const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    primary: "#FFD700",
    secondary: "#00FF87",
    glass: "rgba(255,255,255,0.08)",
    placeholder: "rgba(255,255,255,0.6)",
    bg: "#000",
  },
};

export default function RateApp() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const starAnim = useRef(new Animated.Value(1)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const handleStarPress = (star) => {
    setRating(star);
    Animated.sequence([
      Animated.spring(starAnim, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(starAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const submitRating = () => {
    if (!rating) {
      alert("Please select a rating first!");
      return;
    }

    Animated.sequence([
      Animated.spring(buttonAnim, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(buttonAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        { rating, message },
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        setSubmitted(true);
        setMessage("");
        setRating(0);
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start(() =>
          setTimeout(() => Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }).start(), 2500)
        );
      })
      .catch((error) => {
        alert("Failed to send feedback: " + error.text);
      });
  };

  return (
    <LinearGradient colors={["#001400", "#000"]} style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center", paddingVertical: HP(8) }}
          >
            {/* Icon */}
            <Animated.View style={styles.iconCircle}>
              <Icon
                name="StarIcon"
                color={theme.colors.primary}
                size={fontSize(60)}
                style={{ shadowColor: theme.colors.secondary, shadowOpacity: 0.8 }}
              />
            </Animated.View>

            {/* Title */}
            <Text style={styles.title}>Rate Our App</Text>

            {/* Subtitle */}
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subtitleGradient}
            >
              <Text style={styles.subtitle}>We value your honest feedback!</Text>
            </LinearGradient>

            {/* Card */}
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(0,0,0,0.4)"]}
              style={styles.card}
            >
              <Text style={styles.heading}>How was your experience?</Text>

              {/* Stars */}
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => handleStarPress(star)} activeOpacity={0.7}>
                    <Animated.View style={{ transform: [{ scale: star === rating ? starAnim : 1 }] }}>
                      <Icon
                        name="StarIcon"
                        color={star <= rating ? theme.colors.primary : "#333"}
                        size={52}
                        style={star <= rating && styles.glow}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Message Box */}
              <TextInput
                style={styles.messageBox}
                placeholder="Write your feedback here..."
                placeholderTextColor={theme.colors.placeholder}
                value={message}
                onChangeText={setMessage}
                multiline
              />

              {/* Submit Button */}
              <Animated.View style={[{ transform: [{ scale: buttonAnim }] }]}>
                <TouchableOpacity
                  style={[styles.button, { opacity: rating ? 1 : 0.5 }]}
                  onPress={submitRating}
                  disabled={!rating}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.buttonInner}
                  >
                    <Text style={styles.buttonText}>Submit Feedback</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </ScrollView>

          {/* Success Toast */}
          {submitted && (
            <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
              <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.toastGradient}>
                <Text style={styles.toastText}>✨ Thank you for your feedback!</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  glow1: {
    position: "absolute",
    width: 350,
    height: 350,
   
    borderRadius: 175,
    top: HP(10),
    left: WP(10),
  },
  glow2: {
    position: "absolute",
    width: 300,
    height: 300,

    borderRadius: 150,
    bottom: HP(8),
    right: WP(10),
  },
  keyboardView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    alignSelf: "center",
    marginBottom: HP(2),
    padding: WP(6),
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.secondary,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 15,
  },
  title: {
    fontSize: fontSize(32),
    fontWeight: "800",
    color: theme.colors.white,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  subtitleGradient: {
    alignSelf: "center",
    borderRadius: 25,
    marginVertical: HP(2),
    paddingHorizontal: WP(5),
    paddingVertical: HP(0.8),
  },
  subtitle: {
    fontSize: fontSize(15),
    color: theme.colors.black,
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: theme.colors.glass,
    borderRadius: 20,
    width: "90%",
    paddingVertical: HP(3),
    paddingHorizontal: WP(4),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: theme.colors.white,
    textAlign: "center",
    marginBottom: HP(3),
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: HP(3),
  },
  glow: {
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  messageBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: WP(4),
    fontSize: fontSize(14),
    color: theme.colors.white,
    minHeight: HP(12),
    textAlignVertical: "top",
    backgroundColor: theme.colors.glass,
    marginBottom: HP(3),
  },
  button: { borderRadius: 25, overflow: "hidden" },
  buttonInner: {
    paddingVertical: HP(2),
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.black,
    fontSize: fontSize(17),
    fontWeight: "700",
  },
  toast: {
    position: "absolute",
    bottom: HP(10),
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  toastGradient: {
    paddingVertical: HP(1.5),
    paddingHorizontal: WP(6),
    borderRadius: 20,
  },
  toastText: {
    color: theme.colors.black,
    fontWeight: "700",
    fontSize: fontSize(14),
    textAlign: "center",
  },
});
