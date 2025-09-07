// MotivationScreen.js
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // 🎨 Gradient
import { hp, wp } from "../../helpers/common";

// ✅ Firebase imports
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";

const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#27D5E8",
    grayBG: "#F5F5F5",
    dark: "#0F172A",
    neutral: (opacity) => `rgba(0,0,0,${opacity})`,
  },
};

const tabs = [
  { id: "home", icon: "home-outline", lib: Ionicons, route: "/" },
  { id: "lightbulb", icon: "lightbulb", lib: FontAwesome5, route: "/motivation" },
  { id: "settings", icon: "settings-outline", lib: Ionicons, route: "/setting" },
  { id: "quiz", icon: "help-outline", lib: MaterialIcons, route: "/quiz" },
];

const MotivationScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const router = useRouter();
  const profileAnim = useRef(new Animated.Value(1)).current;
  const tabScale = useRef({}).current;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(app);
        const db = getFirestore(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTabPress = (tabId, route) => {
    if (!tabScale[tabId]) tabScale[tabId] = new Animated.Value(1);

    Animated.sequence([
      Animated.spring(tabScale[tabId], { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(tabScale[tabId], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    router.push(route);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.grayBG, paddingTop }}>
      {/* ✅ Top Bar */}
      <View style={styles.header}>
        <View>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.welcomeText}>
              Welcome{userData?.name ? `, ${userData.name}` : "!"}
            </Text>
          )}
        </View>
        <Pressable
          onPressIn={() =>
            Animated.spring(profileAnim, { toValue: 0.9, useNativeDriver: true }).start()
          }
          onPressOut={() =>
            Animated.spring(profileAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start()
          }
        >
          <Animated.View
            style={[styles.profileImageContainer, { transform: [{ scale: profileAnim }] }]}
          >
            {userData?.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
            ) : (
              <Image
                source={require("../../assets/images/imagea.png")}
                style={styles.profileImage}
              />
            )}
          </Animated.View>
        </Pressable>
      </View>

      {/* ✅ Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Motivational content with gradient */}
        <LinearGradient
          colors={["#27D5E8", "#0F172A"]}
          style={styles.motivationBox}
        >
          <Text style={styles.motivationTitle}>Stay Inspired ✨</Text>
          <Text style={styles.motivationText}>
            {userData?.lastPlayed
              ? `Last played: ${new Date(userData.lastPlayed).toLocaleString()}`
              : "This is your dedicated Motivation Screen.\nAdd quotes, verses, or images here."}
          </Text>
        </LinearGradient>

        {/* Explore Section */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreHeader}>
            <Text style={styles.exploreTitle}>Explore</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <View style={styles.cardGrid}>
            <View style={styles.card}>
              <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Daily Verse</Text>
              <Text style={styles.cardDesc}>
                Read a verse each day and grow spiritually.
              </Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.cardTitle}>Daily Quote</Text>
              <Text style={styles.cardDesc}>
                Get uplifting thoughts to start your day.
              </Text>
            </View>

            <View style={styles.card}>
              <Ionicons name="sparkles-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Motivation</Text>
              <Text style={styles.cardDesc}>
                Stay inspired with curated messages.
              </Text>
            </View>

            <View style={styles.card}>
              <Ionicons name="code-slash-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Daily Code</Text>
              <Text style={styles.cardDesc}>
                Faith-driven code snippets every day.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ✅ Bottom Nav */}
      <View style={styles.floatingBottomNav}>
        {tabs.map(({ id, icon, lib: IconLib, route }) => {
          if (!tabScale[id]) tabScale[id] = new Animated.Value(1);
          return (
            <Pressable key={id} onPress={() => handleTabPress(id, route)}>
              <Animated.View
                style={[
                  styles.iconWrapper,
                  id === "lightbulb" && styles.activeIcon,
                  { transform: [{ scale: tabScale[id] }] },
                ]}
              >
                <IconLib
                  name={icon}
                  size={24}
                  color={id === "lightbulb" ? theme.colors.primary : "#fff"}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  welcomeText: {
    fontSize: hp(2.4),
    fontWeight: "600",
    color: theme.colors.black,
  },
  profileImageContainer: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },

  motivationBox: {
    margin: wp(4),
    borderRadius: 18,
    padding: wp(6),
  },
  motivationTitle: {
    fontSize: hp(3),
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  motivationText: {
    fontSize: hp(2),
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
  },

  exploreSection: {
    marginTop: hp(2),
    paddingHorizontal: wp(4),
  },
  exploreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  exploreTitle: {
    fontSize: hp(2.6),
    fontWeight: "700",
    color: theme.colors.black,
  },
  seeAll: {
    fontSize: hp(2),
    color: theme.colors.primary,
    fontWeight: "500",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    marginTop: hp(1),
    fontSize: hp(2.2),
    fontWeight: "600",
    color: theme.colors.black,
  },
  cardDesc: {
    fontSize: hp(1.7),
    color: theme.colors.neutral(0.6),
    marginTop: 4,
  },

  floatingBottomNav: {
    position: "absolute",
    bottom: hp(3),
    left: wp(5),
    right: wp(5),
    height: hp(8),
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: hp(4),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 6 }, shadowRadius: 8 },
      android: { elevation: 10 },
    }),
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 30,
  },
  activeIcon: {
    backgroundColor: "#fff",
  },
});

export default MotivationScreen;
