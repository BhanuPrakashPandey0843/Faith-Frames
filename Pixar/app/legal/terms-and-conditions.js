// app/legal/terms-and-conditions.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FileTextIcon } from "lucide-react-native"; // ✅ replaced missing ScrollTextIcon
import { fontSize, HP, WP } from "../theme/scale";

const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    primary: "#FFD700",
    secondary: "#00FF87",
    glass: "rgba(255,255,255,0.1)",
    placeholder: "rgba(255,255,255,0.6)",
    bg: "#000",
  },
};

const TERMS = [
  {
    title: "1. Eligibility",
    body:
      "You must be at least 13 years old to use Faith Frames. If you are under 18, you must have permission from a parent or legal guardian.",
  },
  {
    title: "2. Subscription and Payments",
    body:
      "Faith Frames requires a one-time subscription fee for full access. Payments are processed securely through trusted gateways (Razorpay, Stripe, PayPal). Non-refundable except as required by law. Personal, non-commercial use only.",
  },
  {
    title: "3. Use of Content",
    body:
      "All wallpapers, Bible verses, prayers, and other content provided are for personal and devotional use only. You may not reproduce, resell, or redistribute without written permission.",
  },
  {
    title: "4. Wallpaper and Data Updates",
    body:
      "Wallpapers, daily verses, and prayers update automatically based on preferences. Some features require internet connection for full functionality.",
  },
  {
    title: "5. User Accounts",
    body:
      "You are responsible for keeping your login credentials secure. Provide accurate information. We may suspend accounts violating these Terms.",
  },
  {
    title: "6. Chat and Communication",
    body:
      "The in-app chat with Admin is for support and updates only. Abusive or spam messages may lead to suspension.",
  },
  {
    title: "7. Intellectual Property",
    body:
      "All content, designs, and technology in Faith Frames are owned or licensed to us. “Faith Frames” and its logo are trademarks of Faith Frames.",
  },
  {
    title: "8. Prohibited Activities",
    body:
      "Do not hack, reverse-engineer, or bypass security. No unlawful use or uploading of malicious code.",
  },
  {
    title: "9. Limitation of Liability",
    body:
      "We do not guarantee uninterrupted service. Not liable for damages or device issues. Content is provided 'as is'.",
  },
  {
    title: "10. Privacy Policy",
    body:
      "Your privacy is important. Please read our Privacy Policy to understand our practices.",
  },
  {
    title: "11. Termination",
    body:
      "We may suspend or terminate access if you violate these Terms. You may uninstall at any time.",
  },
  {
    title: "12. Changes to Terms",
    body:
      "We may update these Terms anytime. Continued use means you accept the updates.",
  },
];

export default function TermsAndConditions() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#001400", "#000"]} style={styles.container}>
      {/* Glow background elements */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: HP(8),
          paddingHorizontal: WP(6),
        }}
      >
        {/* Header Icon */}
        <Animated.View
          style={[
            styles.iconCircle,
            {
              opacity: iconAnim,
              transform: [
                {
                  scale: iconAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <FileTextIcon
            size={fontSize(60)}
            color={theme.colors.primary}
            style={{ shadowColor: theme.colors.secondary, shadowOpacity: 0.8 }}
          />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          Terms & Conditions
        </Animated.Text>

        {/* Subtitle */}
        <Animated.View
          style={[
            styles.subtitleWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subtitleGradient}
          >
            <Text style={styles.subtitle}>
              Please read carefully before using Faith Frames
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Terms Content */}
        <Animated.View
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            styles.policyWrapper,
          ]}
        >
          {TERMS.map((item, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>{item.body}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  glow1: {
    position: "absolute",
    width: 350,
    height: 350,
    backgroundColor: "",
    borderRadius: 175,
    top: HP(10),
    left: WP(10),
  },
  glow2: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "",
    borderRadius: 150,
    bottom: HP(8),
    right: WP(10),
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
  subtitleWrapper: {
    alignSelf: "center",
    borderRadius: 25,
    marginVertical: HP(2),
  },
  subtitleGradient: {
    paddingHorizontal: WP(5),
    paddingVertical: HP(0.8),
    borderRadius: 25,
  },
  subtitle: {
    fontSize: fontSize(15),
    color: theme.colors.black,
    fontWeight: "600",
    textAlign: "center",
  },
  policyWrapper: {
    marginTop: HP(2),
  },
  card: {
    backgroundColor: theme.colors.glass,
    borderRadius: 16,
    paddingHorizontal: WP(4),
    paddingVertical: HP(2),
    marginBottom: HP(2),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: fontSize(17),
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: HP(1),
  },
  cardText: {
    fontSize: fontSize(14),
    lineHeight: fontSize(20),
    color: theme.colors.white,
  },
});
