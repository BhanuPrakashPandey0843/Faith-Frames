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
import { db } from "../../firebaseConfig"; // ✅ Your Firebase config
import TopBar from "../../components/TopBar";

const Witness = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Real-time Firestore listener
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

  // ✅ Like button handler
  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, "witnessPosts", postId);
    await updateDoc(postRef, {
      likes: (currentLikes || 0) + 1,
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4286f4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Witness" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {posts.length === 0 ? (
          <Text style={styles.noPosts}>No testimonies shared yet.</Text>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.card}>
              {/* ✅ Show image if available, else fallback */}
              <Image
                source={{
                  uri:
                    post.imageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/1995/1995515.png",
                }}
                style={styles.postImage}
              />

              {/* Title & Message */}
              <Text style={styles.heading}>🕊 {post.title}</Text>
              <Text style={styles.text}>{post.message}</Text>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLike(post.id, post.likes || 0)}
                >
                  <Ionicons name="heart" size={24} color="#e63946" />
                  <Text style={styles.likeText}>{post.likes || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Witness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // ✅ Soft Instagram-like background
  },
  scroll: {
    padding: 16,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
    resizeMode: "cover",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
  },
  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeaea",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  likeText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#e63946",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPosts: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
});


