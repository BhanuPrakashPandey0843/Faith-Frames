import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";

const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFD700",
    secondary: "#00FF87",
    dark: "#001400",
  },
};

const MeetShare = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch meet sessions in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "meetSessions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ❤️ Handle Likes / Dislikes
  const handleReaction = async (id, field, currentValue) => {
    try {
      const ref = doc(db, "meetSessions", id);
      await updateDoc(ref, { [field]: (currentValue || 0) + 1 });
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  // 🌐 Open Meet link
  const openLink = (url) => {
    if (url && url.startsWith("http")) {
      Linking.openURL(url);
    } else {
      Alert.alert("Invalid Link", "This meeting link is not valid.");
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#001400", "#000"]} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#001400", "#000"]} style={styles.container}>
      {/* Header */}
      <BlurView intensity={60} tint="dark" style={styles.header}>
        <Text style={styles.title}>💬 Meet Sessions</Text>
      </BlurView>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {sessions.length === 0 ? (
          <Text style={styles.noPosts}>No sessions available.</Text>
        ) : (
          sessions
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .map((s) => (
              <LinearGradient
                key={s.id}
                colors={["rgba(255,215,0,0.08)", "rgba(0,255,135,0.05)"]}
                style={styles.cardGradient}
              >
                <BlurView intensity={40} tint="dark" style={styles.card}>
                  <TouchableOpacity onPress={() => openLink(s.meetLink)}>
                    <Text style={styles.meetLink} numberOfLines={1}>
                      🔗 {s.meetLink}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.message}>{s.message}</Text>

                  <View style={styles.footerRow}>
                    {s.createdAt?.seconds && (
                      <Text style={styles.dateText}>
                        {new Date(s.createdAt.seconds * 1000).toLocaleString()}
                      </Text>
                    )}

                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.reactBtn}
                        onPress={() => handleReaction(s.id, "likes", s.likes || 0)}
                      >
                        <Ionicons name="heart" size={22} color="#ff4d6d" />
                        <Text style={styles.reactText}>{s.likes || 0}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.reactBtn, { marginLeft: wp(3) }]}
                        onPress={() =>
                          handleReaction(s.id, "dislikes", s.dislikes || 0)
                        }
                      >
                        <Ionicons name="thumbs-down" size={22} color="#00BFFF" />
                        <Text style={[styles.reactText, { color: "#00BFFF" }]}>
                          {s.dislikes || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </BlurView>
              </LinearGradient>
            ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default MeetShare;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(2),
    borderRadius: 16,
    marginHorizontal: wp(4),
    marginTop: hp(3),
    marginBottom: hp(2),
    overflow: "hidden",
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: 0.6,
  },
  scroll: { paddingHorizontal: wp(4), paddingBottom: hp(10) },
  cardGradient: {
    borderRadius: 20,
    marginBottom: hp(2.5),
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    padding: wp(4),
    borderWidth: 1.5,
    borderColor: "rgba(255,215,0,0.25)",
  },
  meetLink: {
    fontSize: hp(2.1),
    fontWeight: "700",
    color: theme.colors.primary,
    textDecorationLine: "underline",
    marginBottom: hp(0.8),
  },
  message: {
    fontSize: hp(2),
    color: "rgba(255,255,255,0.85)",
    lineHeight: hp(3),
    marginBottom: hp(1.2),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: { fontSize: hp(1.6), color: "rgba(255,255,255,0.6)" },
  actions: { flexDirection: "row", alignItems: "center" },
  reactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  reactText: {
    marginLeft: wp(1.5),
    fontSize: hp(1.9),
    fontWeight: "600",
    color: "#ff4d6d",
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    marginTop: hp(10),
    color: "rgba(255,255,255,0.6)",
  },
});
