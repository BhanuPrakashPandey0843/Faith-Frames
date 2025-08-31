import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "../../components/TopBar";

const GodsWords = () => {
  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <TopBar title="God's Words" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.heading}>📖 Reflection</Text>
          <Text style={styles.text}>
            "Be strong and courageous. Do not be afraid; do not be discouraged, 
            for the Lord your God will be with you wherever you go." - Joshua 1:9
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default GodsWords;

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
