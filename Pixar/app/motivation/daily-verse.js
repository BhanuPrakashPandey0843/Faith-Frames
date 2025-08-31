import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "../../components/TopBar";

const DailyVerse = () => {
  return (
    <LinearGradient colors={["#1a2a6c", "#b21f1f", "#fdbb2d"]} style={styles.container}>
      <TopBar title="Daily Verse" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.heading}>🌿 Verse of the Day</Text>
          <Text style={styles.text}>
            "The Lord is my shepherd, I shall not want." - Psalm 23:1
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DailyVerse;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#333" },
  text: { fontSize: 16, color: "#444", lineHeight: 22 },
});
