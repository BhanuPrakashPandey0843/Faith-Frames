import React from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../../components/TopBar";
import { LinearGradient } from "expo-linear-gradient";

const PlanDetail = () => {
  const { title, image, description } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TopBar title={title} backAction={() => router.back()} />

      <ScrollView>
        <ImageBackground source={{ uri: image }} style={styles.headerImage}>
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>About this Plan</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PlanDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    height: 250,
    justifyContent: "flex-end",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    padding: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
});
