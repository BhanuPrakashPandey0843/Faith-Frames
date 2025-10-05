// app/legal/privacy-policy.js
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
import Icon from "../../components/Icon";
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

const POLICY = [
  {
    title: "1. Information We Collect",
    body:
      "We may collect the following types of information:\n\n" +
      "a. Personal Information (provided by you):\n- Name\n- Email address\n- Mobile number\n- Profile photo and cover photo\n- Payment information (processed securely by third-party payment gateways)\n\n" +
      "b. Automatically Collected Information:\n- Device information (model, OS version)\n- App usage statistics\n- IP address and approximate location (if permissions granted)\n\n" +
      "c. Content Data:\n- Your wallpaper preferences, favourites, and settings\n- Chat messages sent to Admin",
  },
  {
    title: "2. How We Use Your Information",
    body:
      "We use your information to:\n- Provide and improve Faith Frames\n- Process subscription payments\n- Send daily wallpapers, verses, and prayers\n- Respond to support requests\n- Send notifications, updates, and offers\n- Maintain security and prevent fraud",
  },
  {
    title: "3. Data Storage and Security",
    body:
      "All personal data is stored securely in encrypted databases (e.g., Firebase). Payment details are processed via secure gateways; we do not store your card/bank details. End-to-end encryption is used for chat and sensitive data.",
  },
  {
    title: "4. Sharing of Information",
    body:
      "We do not sell, rent, or trade your personal information.\n\nWe may share data only with:\n- Service Providers: Payment processing, analytics, and storage\n- Legal Requirements: If required by law or to protect rights and safety",
  },
  {
    title: "5. Your Privacy Choices",
    body:
      "You can:\n- Update your profile in the App\n- Disable notifications in device settings\n- Request deletion of your account and data by contacting us",
  },
  {
    title: "6. Offline Mode",
    body:
      "Some features work offline, but certain updates (e.g., wallpapers, verses, prayers) require internet. Data collected offline syncs when you reconnect.",
  },
  {
    title: "7. Children’s Privacy",
    body:
      "Faith Frames is not intended for children under 13. We do not knowingly collect personal data from children.",
  },
  {
    title: "8. Third-Party Links and Services",
    body:
      "Faith Frames may link to third-party sites or use third-party services (e.g., payment providers). We are not responsible for their privacy practices.",
  },
  {
    title: "9. Changes to This Policy",
    body:
      "We may update this Privacy Policy periodically. You will be notified via the App or email when changes occur.",
  },
];

export default function PrivacyPolicy() {
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
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: HP(8), paddingHorizontal: WP(6) }}
      >
        {/* Header Icon */}
        <Animated.View
          style={[
            styles.iconCircle,
            {
              opacity: iconAnim,
              transform: [
                { scale: iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
              ],
            },
          ]}
        >
          <Icon name="ShieldCheckIcon" size={fontSize(60)} color={theme.colors.primary} />
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
          Privacy Policy
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
            <Text style={styles.subtitle}>Your privacy is our top priority</Text>
          </LinearGradient>
        </Animated.View>

        {/* Policy Content */}
        <Animated.View
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            styles.policyWrapper,
          ]}
        >
          {POLICY.map((item, i) => (
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
    backgroundColor: "transparent",
    borderRadius: 175,
    top: HP(10),
    left: WP(10),
    blurRadius: 100,
  },
  glow2: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "transparent",
    borderRadius: 150,
    bottom: HP(8),
    right: WP(10),
    blurRadius: 100,
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
