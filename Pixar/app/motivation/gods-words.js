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
import TopBar from "../../components/TopBar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// ✅ Import Firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // <-- make sure this points to your Firebase config

const GodsWords = () => {
  const router = useRouter();
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    router.push("/motivation/MotivationScreen");
  };

  // ✅ Fetch study plans from Firestore
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

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
                  image: plan.image,
                  description: plan.description,
                  duration: plan.duration,
                },
              })
            }
          >
            <ImageBackground
              source={{ uri: plan.image }}
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
                <Text style={styles.durationText}>
                  {plan.duration || "3 Days"}
                </Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
