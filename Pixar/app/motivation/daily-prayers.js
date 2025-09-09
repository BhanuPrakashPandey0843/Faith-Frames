import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function DailyPrayers() {
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        // Fetch all documents from 'dailyprayers'
        const querySnapshot = await getDocs(collection(db, "dailyprayers"));
        console.log("Firestore docs:", querySnapshot.docs);

        let prayers = querySnapshot.docs.map((doc) => doc.data());

        // If no data found, add a fallback prayer so UI still shows
        if (prayers.length === 0) {
          prayers = [
            {
              verse: "Blessed are the peacemakers, for they shall be called children of God.",
              reference: "Matthew 5:9",
              bgurl: "https://res.cloudinary.com/dhliwva4d/image/upload/v1757249305/faithframes/uploadverce/kpftrz9dvuduslefpvdv.jpg",
            },
          ];
          console.log("Using fallback prayer");
        }

        // Pick prayer for today based on day-of-year
        const today = new Date();
        const dayOfYear = Math.floor(
          (today - new Date(today.getFullYear(), 0, 0)) / 86400000
        );
        const prayerIndex = dayOfYear % prayers.length;

        setPrayerData(prayers[prayerIndex]);
      } catch (error) {
        console.log("🔥 Error fetching prayers:", error);
        // Fallback prayer if Firestore fails completely
        setPrayerData({
          verse: "Blessed are the peacemakers, for they shall be called children of God.",
          reference: "Matthew 5:9",
          bgurl: "https://res.cloudinary.com/dhliwva4d/image/upload/v1757249305/faithframes/uploadverce/kpftrz9dvuduslefpvdv.jpg",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayer();
  }, []);

  const handleShare = async () => {
    if (!prayerData) return;
    try {
      await Share.share({
        message: `${prayerData.verse} – ${prayerData.reference}`,
      });
    } catch (error) {
      alert("Error sharing prayer");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#27D5E8" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: prayerData.bgurl }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Top Bar with Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.push("/motivation")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Daily Prayers</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Prayer Card */}
        <View style={styles.card}>
          <Text style={styles.verseText}>"{prayerData.verse}"</Text>
          <Text style={styles.reference}>{prayerData.reference}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", padding: 20, justifyContent: "center" },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 6,
  },
  topTitle: { fontSize: 22, fontWeight: "bold", color: "white" },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  verseText: { fontSize: 22, fontWeight: "bold", color: "white", textAlign: "center", lineHeight: 32, marginBottom: 12 },
  reference: { fontSize: 18, fontWeight: "600", color: "#FFD700", marginBottom: 25 },
  actions: { flexDirection: "row", justifyContent: "space-around", width: "60%" },
  iconButton: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 30, padding: 10, marginHorizontal: 10, shadowColor: "#000", shadowOpacity: 0.4, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 5 },
  loader: { flex: 1, backgroundColor: "black", alignItems: "center", justifyContent: "center" },
});
