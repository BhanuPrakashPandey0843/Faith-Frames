// E:\2025\Freelance\Faith-Frames\Pixar\app\rate-app\index.js
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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "../../components/Icon";
import TopBar from "../../components/TopBar";
import { colors } from "../theme/colors";
import { HP, WP, fontSize } from "../theme/scale";
import emailjs from "emailjs-com";

export default function RateApp() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const animation = useRef(new Animated.Value(1)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const safeBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace("/setting");
    }
  };

  const handleStarPress = (star) => {
    setRating(star);
    Animated.sequence([
      Animated.spring(animation, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(animation, { toValue: 1, friction: 4, useNativeDriver: true }),
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

    // Send feedback via EmailJS
    emailjs
      .send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS Template ID
        {
          rating: rating,
          message: message,
        },
        "YOUR_PUBLIC_KEY" // Replace with your EmailJS Public Key
      )
      .then(() => {
        alert("Thanks! Your feedback has been sent.");
        setRating(0);
        setMessage("");
      })
      .catch((error) => {
        alert("Failed to send feedback: " + error.text);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TopBar
          title="Rate Our App"
          leftView={
            <TouchableOpacity onPress={safeBack}>
              <Icon name="ChevronLeftIcon" color={colors.black} />
            </TouchableOpacity>
          }
        />

        <ScrollView
          contentContainerStyle={{ paddingBottom: HP(15) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>We value your feedback!</Text>
          <Text style={styles.subText}>Tap the stars to rate us</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Animated.View
                  style={{
                    transform: [{ scale: star === rating ? animation : 1 }],
                  }}
                >
                  <Icon
                    name="StarIcon"
                    color={star <= rating ? "#FFD700" : "#ccc"}
                    size={50}
                  />
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.messageBox}
            placeholder="Write your feedback here..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </ScrollView>

        {/* Fixed Bottom Submit Button */}
        <Animated.View
          style={[styles.buttonContainer, { transform: [{ scale: buttonAnim }] }]}
        >
          <TouchableOpacity
            style={[styles.button, { opacity: rating ? 1 : 0.5 }]}
            onPress={submitRating}
            disabled={!rating}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: WP(5),
  },
  heading: {
    fontSize: fontSize(22),
    fontWeight: "bold",
    color: colors.black,
    marginTop: HP(5),
    textAlign: "center",
  },
  subText: {
    color: "#555",
    textAlign: "center",
    marginTop: HP(1),
    marginBottom: HP(5),
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: HP(3),
  },
  messageBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    padding: WP(4),
    fontSize: fontSize(14),
    color: colors.black,
    minHeight: HP(15),
    textAlignVertical: "top",
    marginTop: HP(3),
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    position: "absolute",
    bottom: HP(3),
    left: WP(5),
    right: WP(5),
  },
  button: {
    backgroundColor: colors.white, // White button
    paddingVertical: HP(2),
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.black,
  },
  buttonText: {
    color: colors.black, // Black text
    fontSize: fontSize(16),
    fontWeight: "600",
  },
});
