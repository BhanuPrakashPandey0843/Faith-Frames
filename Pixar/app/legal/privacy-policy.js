// app/legal/privacy-policy.js
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import TopBar from "../../components/TopBar";
import Icon from "../../components/Icon";
import { colors } from "../theme/colors";
import { fontSize, WP, HP } from "../theme/scale";

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

const PrivacyPolicy = () => {
  const router = useRouter();
  const pathname = usePathname();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const safeBack = () => {
    // If not already in settings, navigate there, else go back
    if (pathname !== "/setting") {
      router.replace("/setting");
    } else {
      router.back();
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar
        title="Privacy Policy"
        leftView={
          <TouchableOpacity
            onPress={safeBack}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Icon name="ChevronLeftIcon" color={colors.dark} />
          </TouchableOpacity>
        }
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Privacy Policy – Faith Frames</Text>
          <Text style={styles.lastUpdated}>Last Updated: </Text>

          {POLICY.map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.card,
                {
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
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

export default PrivacyPolicy;

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
