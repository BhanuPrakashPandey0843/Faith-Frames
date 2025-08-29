// app/quiz/ThanksScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { HP, WP, fontSize } from "../theme/scale";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ThanksScreen = () => {
  const router = useRouter();
  const { score, total } = useLocalSearchParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, "users"),
          orderBy("latestScore", "desc"),
          limit(50)
        );
        const snap = await getDocs(q);

        const data = snap.docs.map((doc, idx) => ({
          id: doc.id,
          rank: idx + 1,
          ...doc.data(),
        }));

        setLeaderboard(data);

        // ✅ Find current user's rank
        if (currentUser) {
          const found = data.find((u) => u.id === currentUser.uid);
          if (found) setUserRank(found.rank);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderItem = ({ item }) => {
    const isCurrentUser = currentUser && item.id === currentUser.uid;

    return (
      <View
        style={[
          styles.card,
          isCurrentUser && styles.currentUserCard,
        ]}
      >
        <Text style={[styles.rank, isCurrentUser && styles.highlightTxt]}>
          #{item.rank}
        </Text>

        {item.photoURL ? (
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: "#333" }]} />
        )}

        <Text style={[styles.name, isCurrentUser && styles.highlightTxt]}>
          {item.name || "Anonymous"}
        </Text>

        <Text style={[styles.score, isCurrentUser && styles.highlightTxt]}>
          {item.latestScore} / {item.total || 20}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#000", "#111", "#000"]} style={styles.container}>
      <Text style={styles.header}> Leaderboard </Text>

      {/* ✅ User Summary Card */}
      {currentUser && (
        <View style={styles.userSummaryCard}>
          {currentUser.photoURL ? (
            <Image source={{ uri: currentUser.photoURL }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, { backgroundColor: "#333" }]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryText}>
              {currentUser.displayName || "Anonymous"}
            </Text>
            <Text style={styles.subSummaryText}>ID: {currentUser.uid}</Text>
            <Text style={styles.subSummaryText}>
              Score: {score} / {total}
            </Text>
            {userRank && (
              <Text style={styles.subSummaryText}>Rank: #{userRank}</Text>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* ✅ Button shifted up */}
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: HP(5),
    paddingHorizontal: WP(6),
  },
  header: {
    fontSize: fontSize(28),
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: HP(2),
  },
  userSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: WP(4),
    borderRadius: WP(6),
    marginBottom: HP(2),
    borderWidth: 1,
    borderColor: "#fff",
  },
  userAvatar: {
    width: WP(14),
    height: WP(14),
    borderRadius: WP(7),
    marginRight: WP(4),
  },
  summaryText: {
    fontSize: fontSize(18),
    color: "#fff",
    fontWeight: "800",
  },
  subSummaryText: {
    fontSize: fontSize(14),
    color: "#bbb",
    fontWeight: "600",
  },
  list: {
    paddingBottom: HP(2),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: HP(2),
    paddingHorizontal: WP(5),
    borderRadius: WP(6),
    marginBottom: HP(1.5),
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  rank: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: "#bbb",
    width: WP(12),
  },
  avatar: {
    width: WP(10),
    height: WP(10),
    borderRadius: WP(5),
    marginRight: WP(4),
  },
  name: {
    fontSize: fontSize(16),
    color: "#eee",
    fontWeight: "600",
    flex: 1,
  },
  score: {
    fontSize: fontSize(16),
    fontWeight: "600",
    color: "#bbb",
  },
  highlightTxt: {
    color: "#fff",
    fontWeight: "900",
  },
  button: {
    marginTop: HP(2), // shifted up
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingVertical: HP(1.5),
    paddingHorizontal: WP(12),
    borderRadius: WP(10),
  },
  buttonText: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
});

export default ThanksScreen;
