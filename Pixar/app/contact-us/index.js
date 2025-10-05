// Pixar/app/contact/index.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fontSize, HP, WP } from "../theme/scale";
import Icon from "../../components/Icon";
import axios from "axios";

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

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.sequence([
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
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    Animated.sequence([
      Animated.spring(toastAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setToast(""));
  };

  const sendMessage = async () => {
    if (!name || !email || !message) {
      showToast("Please fill all fields ⚠️");
      return;
    }
    setLoading(true);
    try {
      const SERVICE_ID = "your_service_id";
      const TEMPLATE_ID = "your_template_id";
      const PUBLIC_KEY = "your_public_key";

      await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: { from_name: name, from_email: email, message },
      });

      showToast("Message Sent Successfully ✨");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      showToast("Failed to Send Message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#001400", "#000"]} style={styles.container}>
      {/* Animated floating glows */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: HP(6),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Icon */}
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
          <Icon
            name="ChatBubbleOvalLeftEllipsisIcon"
            size={fontSize(60)}
            color={theme.colors.primary}
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
          Contact Us
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
            <Text style={styles.subtitle}>We’d love to hear from you </Text>
          </LinearGradient>
        </Animated.View>

        {/* Inputs */}
        <Animated.View
          style={[
            styles.form,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {["Your Name", "Your Email", "Your Message"].map((placeholder, i) => (
            <View key={i} style={styles.inputCard}>
              <TextInput
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder}
                value={i === 0 ? name : i === 1 ? email : message}
                onChangeText={(val) =>
                  i === 0 ? setName(val) : i === 1 ? setEmail(val) : setMessage(val)
                }
                style={[
                  styles.input,
                  i === 2 ? { minHeight: HP(15), textAlignVertical: "top" } : {},
                ]}
                keyboardType={i === 1 ? "email-address" : "default"}
                multiline={i === 2}
              />
            </View>
          ))}
        </Animated.View>

        {/* Button */}
        <Animated.View
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            { alignItems: "center" },
          ]}
        >
          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.black} />
              ) : (
                <Text style={styles.buttonText}>Send Message</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Toast */}
      {toast ? (
        <Animated.View
          style={[
            styles.toast,
            {
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0],
                  }),
                },
              ],
              opacity: toastAnim,
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.toastInner}
          >
            <Text style={styles.toastText}>{toast}</Text>
          </LinearGradient>
        </Animated.View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  glow1: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "transparents",
    borderRadius: 150,
    top: HP(15),
    left: WP(10),
    blurRadius: 90,
  },
  glow2: {
    position: "absolute",
    width: 250,
    height: 250,
    backgroundColor: "transparent",
    borderRadius: 125,
    bottom: HP(10),
    right: WP(15),
    blurRadius: 80,
  },
  title: {
    fontSize: fontSize(34),
    fontWeight: "800",
    color: theme.colors.white,
    textAlign: "center",
    marginTop: HP(4),
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
  form: {
    marginTop: HP(2),
    marginHorizontal: WP(7),
  },
  inputCard: {
    backgroundColor: theme.colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: WP(4),
    paddingVertical: HP(1.5),
    marginBottom: HP(2),
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    fontSize: fontSize(15),
    color: theme.colors.white,
  },
  button: {
    borderRadius: 99,
    paddingVertical: HP(2.2),
    paddingHorizontal: WP(22),
    marginTop: HP(3),
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    fontSize: fontSize(17),
    fontWeight: "700",
    color: theme.colors.black,
  },
  iconCircle: {
    alignSelf: "center",
    marginTop: HP(2),
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
  toast: {
    position: "absolute",
    bottom: HP(8),
    alignSelf: "center",
  },
  toastInner: {
    paddingHorizontal: WP(8),
    paddingVertical: HP(1.5),
    borderRadius: 25,
  },
  toastText: {
    color: theme.colors.black,
    fontWeight: "700",
    fontSize: fontSize(14),
    textAlign: "center",
  },
});
