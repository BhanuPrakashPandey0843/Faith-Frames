import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { hp, wp } from "../../helpers/common";

const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFD700",
    secondary: "#00FF87",
    dark: "#001400",
    neutral: (opacity) => `rgba(255,255,255,${opacity})`,
  },
};

const GodsWords = () => {
  const router = useRouter();
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "studyPlans"));
        const plans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudyPlans(plans);
      } catch (error) {
        console.error("Error fetching study plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#001400", "#000"]} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#001400", "#000"]} style={styles.container}>
      {/* ✅ Centered Header */}
      <BlurView intensity={60} tint="dark" style={styles.header}>
        <Text style={styles.title}>God’s Words</Text>
      </BlurView>

      {/* ✅ Scrollable Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {studyPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/motivation/PlanDetail",
                params: {
                  title: plan.title,
                  image: plan.image,
                  description: plan.description,
                  duration: plan.duration,
                },
              })
            }
          >
            <LinearGradient
              colors={["rgba(255,215,0,0.08)", "rgba(0,255,135,0.05)"]}
              style={styles.cardGradient}
            >
              <BlurView intensity={40} tint="dark" style={styles.blurCard}>
                <ImageBackground
                  source={{ uri: plan.image }}
                  style={styles.image}
                  imageStyle={styles.imageStyle}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
                    style={styles.overlay}
                  />
                </ImageBackground>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{plan.title}</Text>
                  <View style={styles.duration}>
                    <Text style={styles.durationText}>
                      {plan.duration || "3 Days"}
                    </Text>
                  </View>
                </View>
              </BlurView>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default GodsWords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(8),
    marginTop: hp(5),
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.25)",
    shadowColor: "#FFD700",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  title: {
    fontSize: hp(3.2),
    fontWeight: "800",
    letterSpacing: 1,
    color: theme.colors.primary,
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  scroll: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(10),
    marginTop: hp(3),
  },
  card: {
    marginBottom: hp(2.5),
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#FFD700",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 18,
  },
  blurCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "rgba(255,215,0,0.25)",
  },
  image: {
    height: hp(22),
    width: "100%",
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  textContainer: {
    padding: wp(4),
  },
  cardTitle: {
    fontSize: hp(2.4),
    fontWeight: "700",
    color: theme.colors.white,
    marginBottom: hp(0.8),
  },
  duration: {
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "flex-start",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: 20,
  },
  durationText: {
    fontSize: hp(1.8),
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
