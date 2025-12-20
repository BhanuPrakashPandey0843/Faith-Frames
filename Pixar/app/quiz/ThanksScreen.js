// app/quiz/ThanksScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter, useLocalSearchParams } from "expo-router";
import { HP, WP, fontSize } from "../theme/scale";
import { db } from "../../config/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const { width, height } = Dimensions.get("window");

const ThanksScreen = () => {
  const router = useRouter();
  const { score, total } = useLocalSearchParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // 🎉 Button animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 🎊 Falling ribbons animation
  const ribbons = new Array(12).fill(0).map((_, i) => ({
    x: Math.random() * width,
    delay: i * 300,
    color: ["#FFD700", "#FFB84C", "#FF6347", "#6A5ACD"][i % 4],
  }));

  const ribbonAnimations = ribbons.map(() => new Animated.Value(-50));

  useEffect(() => {
    ribbons.forEach((r, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ribbonAnimations[i], {
            toValue: height + 50,
            duration: 4000,
            delay: r.delay,
            useNativeDriver: true,
          }),
          Animated.timing(ribbonAnimations[i], {
            toValue: -50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

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

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return "#bbb";
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = currentUser && item.id === currentUser.uid;

    return (
      <BlurView intensity={60} tint="dark" style={styles.cardWrapper}>
        <View
          style={[
            styles.card,
            isCurrentUser && styles.currentUserCard,
          ]}
        >
          <Text
            style={[
              styles.rank,
              { color: getRankColor(item.rank) },
              isCurrentUser && styles.highlightTxt,
            ]}
          >
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
      </BlurView>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#0f0f0f", "#1c1c1c", "#000"]} style={styles.container}>
      {/* 🎊 Falling ribbons */}
      {ribbons.map((r, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: r.x,
            transform: [{ translateY: ribbonAnimations[i] }],
          }}
        >
          <View style={[styles.ribbon, { backgroundColor: r.color }]} />
        </Animated.View>
      ))}

      <Text style={styles.header}>🏆 Leaderboard 🏆</Text>

      {/* ✅ User Summary Card */}
      {currentUser && (
        <BlurView intensity={80} tint="dark" style={styles.userSummaryCard}>
          {currentUser.photoURL ? (
            <Image source={{ uri: currentUser.photoURL }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, { backgroundColor: "#333" }]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryText}>
              {currentUser.displayName || "Anonymous"}
            </Text>
            <Text style={styles.subSummaryText}>Score: {score} / {total}</Text>
            {userRank && (
              <Text style={styles.subSummaryText}>Rank: #{userRank}</Text>
            )}
          </View>
        </BlurView>
      )}

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* 🎉 Floating Button */}
      <Animated.View style={{ transform: [{ translateY: floatAnim }], marginBottom: HP(6) }}>
        <LinearGradient
          colors={["#FFD700", "#FFB84C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={() => router.replace("/home")}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
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
    color: "#FFD700",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: HP(2),
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  ribbon: {
    width: 8,
    height: 30,
    borderRadius: 4,
    margin: 2,
  },
  userSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: WP(4),
    borderRadius: WP(6),
    marginBottom: HP(2),
    overflow: "hidden",
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
  cardWrapper: {
    marginBottom: HP(1.5),
    borderRadius: WP(6),
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: HP(2),
    paddingHorizontal: WP(5),
    borderRadius: WP(6),
    backgroundColor: "rgba(20,20,20,0.8)",
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  rank: {
    fontSize: fontSize(18),
    fontWeight: "700",
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
    color: "#FFD700",
    fontWeight: "900",
  },
  button: {
    alignSelf: "center",
    borderRadius: WP(10),
    paddingVertical: HP(1.5),
    paddingHorizontal: WP(12),
    shadowColor: "#FFD700",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: fontSize(18),
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
});

export default ThanksScreen;
