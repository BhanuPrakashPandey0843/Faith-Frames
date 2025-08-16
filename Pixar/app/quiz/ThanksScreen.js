import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { HP, WP, fontSize } from "../theme/scale";

const ThanksScreen = ({ route }) => {
  const router = useRouter();

  // Safely get params (score and total)
  const score = route?.params?.score ?? 0;
  const total = route?.params?.total ?? 0;

  return (
    <LinearGradient
      colors={["#000000", "#1a1a1a"]}
      style={styles.container}
    >
      <Text style={styles.thankText}> Thank You!</Text>
      <Text style={styles.scoreText}>
        You scored <Text style={styles.highlight}>{score}</Text> /{" "}
        <Text style={styles.highlight}>{total}</Text>
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/home")
}

      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: WP(6),
  },
  thankText: {
    fontSize: fontSize(32),
    color: "#fff",
    fontWeight: "800",
    marginBottom: HP(2),
    textAlign: "center",
  },
  scoreText: {
    fontSize: fontSize(22),
    color: "#fff",
    marginBottom: HP(4),
    textAlign: "center",
  },
  highlight: {
    color: "#FFD700",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: HP(2),
    paddingHorizontal: WP(12),
    borderRadius: WP(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
});

export default ThanksScreen;



