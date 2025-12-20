import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../../components/TopBar";

const FavouriteDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  return (
    <View style={styles.container}>
      <TopBar title="Favourite Detail" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.text}>Favourite ID: {id}</Text>
      </View>
    </View>
  );
};

export default FavouriteDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});

