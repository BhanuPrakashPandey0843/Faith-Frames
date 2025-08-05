// Faith-Frames/Pixar/app/payment/index.js
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../../../helpers/common";
import { theme } from "../../../constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { WebView } from "react-native-webview";

const PaymentScreen = () => {
  const [showWebView, setShowWebView] = useState(false);

  const handlePayment = () => {
    setShowWebView(true);
  };

  const razorpayHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          var options = {
            "key": "YOUR_RAZORPAY_KEY", 
            "amount": "5000", // ₹50 in paise
            "currency": "INR",
            "name": "Faith Frames",
            "description": "Unlock Lifetime Access",
            "handler": function (response){
              window.ReactNativeWebView.postMessage("Payment Success: " + response.razorpay_payment_id);
            },
            "prefill": {
              "name": "User",
              "email": "user@example.com",
              "contact": "9999999999"
            },
            "theme": {
              "color": "#121212"
            }
          };
          var rzp1 = new Razorpay(options);
          rzp1.open();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Image
        source={require("../../../assets/images/3d-rendering-black-cross.jpg")}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.6)",
          "white",
          "white",
        ]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {!showWebView ? (
        <View style={styles.contentContainer}>
          <Animated.Text entering={FadeInDown.springify()} style={styles.title}>
            One-Time Payment
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            style={styles.subtitle}
          >
            Pay ₹50 to unlock all features.
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Pressable onPress={handlePayment} style={styles.payButton}>
              <Text style={styles.payText}>Pay ₹50</Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : (
        <WebView
          originWhitelist={["*"]}
          source={{ html: razorpayHTML }}
          onMessage={(event) => {
            alert(event.nativeEvent.data);
            setShowWebView(false);
            // Navigate to Home or unlock features
          }}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: hp(20) }} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    top: -hp(5),
  },
  gradient: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 60,
    gap: 18,
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.neutral(0.9),
  },
  subtitle: {
    fontSize: hp(2),
    color: "#555",
    textAlign: "center",
    marginHorizontal: 30,
  },
  payButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: theme.radius.xl,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  payText: {
    color: theme.colors.white,
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.medium,
  },
});

export default PaymentScreen;
