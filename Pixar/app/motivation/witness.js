import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "../../components/TopBar";

const Witness = () => {
  return (
    <LinearGradient colors={["#373b44", "#4286f4"]} style={styles.container}>
      <TopBar title="Witness" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.heading}>🕊 Testimony</Text>
          <Text style={styles.text}>
            Share how God has worked in your life. Your story may inspire others to grow in faith.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Witness;

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
  },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#333" },
  text: { fontSize: 16, color: "#444", lineHeight: 22 },
});
