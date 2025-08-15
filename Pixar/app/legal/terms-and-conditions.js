// app/legal/terms-and-conditions.js
import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Animated
} from "react-native";
import { useRouter } from "expo-router";
import TopBar from "../../components/TopBar";
import { colors } from "../theme/colors";
import { fontSize, WP, HP } from "../theme/scale";

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

const TermsAndConditions = () => {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar
        title="Terms & Conditions"
        leftView
       
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Terms and Conditions – Faith Frames</Text>
          <Text style={styles.lastUpdated}>Last Updated: </Text>

          {TERMS.map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.card,
                {
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.heading}>{item.title}</Text>
              <Text style={styles.paragraph}>{item.body}</Text>
            </Animated.View>
          ))}

          <View style={{ height: HP(4) }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: WP(5),
    paddingTop: HP(2),
    paddingBottom: HP(3),
  },
  title: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: colors.dark,
    marginBottom: HP(0.5),
  },
  lastUpdated: {
    fontSize: fontSize(14),
    color: colors.placeholder,
    marginBottom: HP(2),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: WP(3),
    padding: WP(4),
    marginBottom: HP(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  heading: {
    fontSize: fontSize(16),
    fontWeight: "600",
    color: colors.dark,
    marginBottom: HP(0.5),
  },
  paragraph: {
    fontSize: fontSize(14),
    lineHeight: fontSize(20),
    color: colors.dark,
  },
});
