import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { useRouter } from "expo-router";

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

const Witness = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "witnessPosts"), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, "witnessPosts", postId);
    await updateDoc(postRef, {
      likes: (currentLikes || 0) + 1,
    });
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
      {/* ✅ Header */}
      <BlurView intensity={60} tint="dark" style={styles.header}>
        
        <Text style={styles.title}>The Witness</Text>
        <View style={{ width: 25 }} />
      </BlurView>

      {/* ✅ Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {posts.length === 0 ? (
          <Text style={styles.noPosts}>No testimonies shared yet.</Text>
        ) : (
          posts.map((post) => (
            <LinearGradient
              key={post.id}
              colors={["rgba(255,215,0,0.08)", "rgba(0,255,135,0.05)"]}
              style={styles.cardGradient}
            >
              <BlurView intensity={40} tint="dark" style={styles.card}>
                <Image
                  source={{
                    uri:
                      post.imageUrl ||
                      "https://cdn-icons-png.flaticon.com/512/1995/1995515.png",
                  }}
                  style={styles.postImage}
                />
                <View style={styles.textSection}>
                  <Text style={styles.heading}>🕊 {post.title}</Text>
                  <Text style={styles.text}>{post.message}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => handleLike(post.id, post.likes || 0)}
                  >
                    <Ionicons name="heart" size={24} color="#e63946" />
                    <Text style={styles.likeText}>{post.likes || 0}</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </LinearGradient>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Witness;

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
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
  },
  scroll: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(10),
  },
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
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: hp(1.5),
    resizeMode: "cover",
  },
  textSection: {
    marginBottom: hp(1.2),
  },
  heading: {
    fontSize: hp(2.3),
    fontWeight: "700",
    marginBottom: hp(0.5),
    color: theme.colors.white,
  },
  text: {
    fontSize: hp(2),
    color: "rgba(255,255,255,0.8)",
    lineHeight: hp(3),
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  likeText: {
    marginLeft: wp(2),
    fontSize: hp(2),
    fontWeight: "600",
    color: "#e63946",
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    marginTop: hp(10),
    color: "rgba(255,255,255,0.6)",
  },
});
