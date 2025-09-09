import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import TopBar from "../../components/TopBar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const studyPlans = [
  {
    id: 1,
    title: "Faith and Trust in God",
    image: { uri: "https://wallpaperaccess.com/full/555228.jpg" },
    description:
      "Learn to put your faith and trust in God in every situation. This plan will guide you with scriptures and reflections that strengthen your reliance on Him.",
  },
  {
    id: 2,
    title: "The Power of Prayer",
    image: { uri: "https://cdn.wallpapersafari.com/14/98/lGXV0T.jpg" },
    description:
      "Discover how prayer changes circumstances and brings peace to the soul. This study plan dives deep into the life-changing habit of prayer.",
  },
  {
    id: 3,
    title: "Overcoming Fear and Anxiety",
    image: { uri: "https://i.etsystatic.com/48999819/r/il/3db1a8/5641974688/il_fullxfull.5641974688_btyv.jpg" },
    description:
      "God has not given us a spirit of fear but of power, love, and a sound mind. Walk through scriptures that help overcome fear and anxiety.",
  },
  {
    id: 4,
    title: "Love and Compassion",
    image: { uri: "https://wallpaperaccess.com/full/667102.jpg" },
    description:
      "Love is the greatest commandment. This plan focuses on cultivating a compassionate heart through God’s word and actions.",
  },
];

const GodsWords = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/motivation/MotivationScreen"); // navigate to motivation screen
  };

  return (
    <View style={styles.container}>
      <TopBar title="God's Words" backAction={handleBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {studyPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/motivation/PlanDetail",
                params: {
                  title: plan.title,
                  image: plan.image.uri,
                  description: plan.description,
                },
              })
            }
          >
            <ImageBackground
              source={plan.image}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
                style={styles.overlay}
              />
            </ImageBackground>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{plan.title}</Text>
              <View style={styles.duration}>
                <Text style={styles.durationText}>3 Days</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default GodsWords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    height: 200,
    width: "100%",
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  textContainer: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  duration: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
});
