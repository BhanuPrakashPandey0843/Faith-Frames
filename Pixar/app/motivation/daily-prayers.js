import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "../../components/TopBar";

const DailyPrayers = () => {
  return (
    <LinearGradient colors={["#232526", "#414345"]} style={styles.container}>
      <TopBar title="Daily Prayers" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.heading}>🙏 Morning Prayer</Text>
          <Text style={styles.text}>
            Heavenly Father, thank You for this new day. Guide me in my thoughts, words, and actions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>🌙 Evening Prayer</Text>
          <Text style={styles.text}>
            Lord, thank You for guiding me today. Forgive my mistakes and give me peace tonight.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DailyPrayers;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#222" },
  text: { fontSize: 16, color: "#444", lineHeight: 22 },
});
