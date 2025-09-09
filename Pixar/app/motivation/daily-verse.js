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
import { useRouter } from "expo-router";  // ✅ Import router

export default function DailyVerse() {
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dailyVerses"));
        const verses = querySnapshot.docs.map((doc) => doc.data());

        if (verses.length > 0) {
          const today = new Date();
          const dayOfYear = Math.floor(
            (today - new Date(today.getFullYear(), 0, 0)) / 86400000
          );
          const verseIndex = dayOfYear % verses.length;

          setVerseData(verses[verseIndex]);
        } else {
          console.log("❌ No verses found in Firestore");
        }
      } catch (error) {
        console.log("🔥 Error fetching verse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  const handleShare = async () => {
    if (!verseData) return;
    try {
      await Share.share({
        message: `${verseData.verse} – ${verseData.reference}`,
      });
    } catch (error) {
      alert("Error sharing verse");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#27D5E8" />
      </View>
    );
  }

  if (!verseData) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "white" }}>No verse available</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: verseData.bgurl }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* 🔹 Top Bar with Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.push("/motivation")} // ✅ Fixed navigation
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Daily Verse</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 🔹 Verse Card */}
        <View style={styles.card}>
          <Text style={styles.verseText}>"{verseData.verse}"</Text>
          <Text style={styles.reference}>{verseData.reference}</Text>

          {/* Actions */}
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
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 20,
    justifyContent: "center",
  },
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
  topTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
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
  verseText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 12,
  },
  reference: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 25,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
  },
  loader: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
