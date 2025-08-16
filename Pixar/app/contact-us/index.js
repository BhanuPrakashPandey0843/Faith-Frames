import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import axios from "axios";
import Icon from "../../components/Icon";
import { colors } from "../theme/colors";
import { fontSize, HP, WP } from "../theme/scale";
import TopBar from "../../components/TopBar";
import { LinearGradient } from "expo-linear-gradient";

export default function ContactUs() {
  const router = useRouter();
  const navigation = useNavigation();

  const toast = useRef(new Animated.Value(0)).current;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const safeBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace("/home");
    }
  };

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    Animated.sequence([
      Animated.timing(toast, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toast, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const sendMessage = async () => {
    if (!name || !email || !message) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const SERVICE_ID = "your_service_id";
      const TEMPLATE_ID = "your_template_id";
      const PUBLIC_KEY = "your_public_key";

      const data = {
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          from_name: name,
          from_email: email,
          message: message,
        },
      };

      await axios.post("https://api.emailjs.com/api/v1.0/email/send", data);
      showToast("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      showToast("Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.background, "#f9f9f9"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <TopBar
          title="Contact Us"
          leftView={
            <TouchableOpacity onPress={safeBack}>
              <Icon name="ChevronLeftIcon" color={colors.dark} />
            </TouchableOpacity>
          }
        />

        <View style={styles.inner}>

          {/* Premium Contact Options */}
          <View style={styles.contactRow}>
            {[
              { name: "PhoneIcon", label: "Call Us" },
              { name: "EnvelopeIcon", label: "Email" },
              { name: "ChatBubbleOvalLeftIcon", label: "Chat" },
            ].map((item, index) => (
              <Animated.View key={index} style={styles.contactBox}>
                <LinearGradient
                  colors={["#000", "#1a1a1a"]}
                  style={styles.glossyBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name={item.name} color={colors.white} size={WP(8)} />
                  <Text style={styles.contactText}>{item.label}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>

          {/* Heading */}
          <Text style={styles.heading}>We’d love to hear from you! </Text>

          {/* Input Fields */}
          <View style={styles.card}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Your Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Type your message..."
              placeholderTextColor={colors.placeholder}
              multiline
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={sendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor:
              toastType === "success" ? colors.dark : "#ff4d4d",
            opacity: toast,
            transform: [
              {
                translateY: toast.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: WP(5) },
  heading: {
    fontSize: fontSize(22),
    fontWeight: "700",
    color: colors.dark,
    marginBottom: HP(3),
    marginTop: HP(2),
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: HP(3),
  },
  contactBox: {
    flex: 1,
    marginHorizontal: WP(1.5),
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
  },
  glossyBox: {
    paddingVertical: HP(3),
    justifyContent: "center",
    alignItems: "center",
  },
  contactText: {
    color: colors.white,
    fontSize: fontSize(12),
    marginTop: HP(1),
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: WP(4),
    marginBottom: HP(2),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: fontSize(14),
    fontWeight: "500",
    color: colors.dark,
    marginBottom: HP(1),
  },
  input: {
    fontSize: fontSize(14),
    color: colors.dark,
  },
  textArea: {
    fontSize: fontSize(14),
    color: colors.dark,
    minHeight: HP(15),
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.dark,
    paddingVertical: HP(2),
    borderRadius: 25,
    alignItems: "center",
    marginTop: HP(3),
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize(16),
    fontWeight: "600",
  },
  toast: {
    position: "absolute",
    top: 40,
    left: WP(10),
    right: WP(10),
    padding: WP(4),
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  toastText: {
    color: colors.white,
    fontSize: fontSize(14),
  },
});
