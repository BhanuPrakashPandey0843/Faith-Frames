// MotivationScreen.js (with full clickable Holy Connect Box)
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase";

const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFD700",
    secondary: "#00FF87",
    dark: "#001400",
  },
};

const tabs = [
  { id: "home", icon: "home-outline", lib: Ionicons, route: "/" },
  { id: "lightbulb", icon: "lightbulb", lib: FontAwesome5, route: "/motivation/MotivationScreen" },
  { id: "settings", icon: "settings-outline", lib: Ionicons, route: "/setting" },
  { id: "quiz", icon: "help-outline", lib: MaterialIcons, route: "/quiz" },
];

const MotivationScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const crossPulse = useRef(new Animated.Value(1)).current;
  const tabScale = useRef({}).current;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lightbulb");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(crossPulse, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(crossPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

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
        if (docSnap.exists()) setUserData(docSnap.data());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleTabPress = (tabId, route) => {
    if (!tabScale[tabId]) tabScale[tabId] = new Animated.Value(1);
    setActiveTab(tabId);
    Animated.sequence([
      Animated.spring(tabScale[tabId], { toValue: 1.2, friction: 3, useNativeDriver: true }),
      Animated.spring(tabScale[tabId], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    router.push(route);
  };

  // 🔗 Handle Holy Connect Box Press
  const handleHolyConnectPress = () => {
    router.push("/motivation/MeetShare");
  };

  return (
    <LinearGradient colors={["#001400", "#000000"]} style={{ flex: 1, paddingTop }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(12) }}>
        {/* HERO SECTION */}
        <Animated.View style={[styles.heroContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.subtitle}>Meet Faith Frames</Text>
          <Text style={styles.title}>Sacred Pathways{"\n"}Begin Here</Text>
        </Animated.View>

        {/* EXPLORE SECTION */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreHeader}>
            <Text style={styles.exploreTitle}>Explore</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <View style={styles.cardGrid}>
            {[
              { icon: "book-outline", title: "Daily Verse", desc: "Scripture daily, soul steady.", route: "/motivation/daily-verse" },
              { icon: "hand-left-outline", title: "Daily Prayer", desc: "One prayer, endless strength.", route: "/motivation/daily-prayers" },
              { icon: "bookmarks-outline", title: "God's Word", desc: "Strength comes from His Word.", route: "/motivation/gods-words" },
              { icon: "people-outline", title: "The Witness", desc: "Your life is testimony.", route: "/motivation/witness" },
            ].map((item, index) => (
              <Pressable key={index} style={styles.card} onPress={() => router.push(item.route)}>
                <LinearGradient colors={["rgba(255,215,0,0.15)", "rgba(0,255,135,0.1)"]} style={styles.cardGradient}>
                  <BlurView intensity={40} tint="dark" style={styles.cardBlur}>
                    <Ionicons name={item.icon} size={30} color={theme.colors.primary} />
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                  </BlurView>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 🕊️ HOLY CONNECT BOX (Entire box clickable) */}
        <Pressable
          onPress={handleHolyConnectPress}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.holyBox}>
            <Animated.View style={[styles.crossIcon, { transform: [{ scale: crossPulse }] }]}>
              <LinearGradient colors={["#FFD700", "#00FF87"]} style={styles.crossInner}>
                <FontAwesome5 name="cross" size={20} color="#fff" />
              </LinearGradient>
            </Animated.View>

            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.holyTitle}>Holy Connect</Text>
              <Text style={styles.holySubtitle}>Pray, listen & receive divine guidance.</Text>
            </View>

            <View style={styles.arrowPressable}>
              <LinearGradient colors={["#FFD700", "#00FF87"]} style={styles.arrowInner}>
                <MaterialIcons name="arrow-forward" size={22} color="#fff" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* 🌟 BOTTOM NAVBAR */}
      <BlurView intensity={40} tint="dark" style={styles.floatingBottomNav}>
        <LinearGradient
          colors={["#00ff87", "#FFD700"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: hp(3.6) }]}
        />
        {tabs.map(({ id, icon, lib: IconLib, route }) => {
          if (!tabScale[id]) tabScale[id] = new Animated.Value(1);
          const isActive = activeTab === id;
          return (
            <Pressable key={id} onPress={() => handleTabPress(id, route)}>
              <Animated.View
                style={[
                  styles.iconWrapper,
                  isActive && styles.activeIconWrapper,
                  { transform: [{ scale: tabScale[id] }] },
                ]}
              >
                <IconLib name={icon} size={23} color={isActive ? theme.colors.black : "#fff"} />
              </Animated.View>
            </Pressable>
          );
        })}
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heroContainer: { alignItems: "flex-start", marginVertical: hp(4), paddingHorizontal: wp(6) },
  title: { fontSize: hp(3.8), fontWeight: "800", color: "#fff", lineHeight: hp(4.6), letterSpacing: 0.5 },
  subtitle: { fontSize: hp(2.1), fontWeight: "500", color: "rgba(255,255,255,0.85)", marginBottom: hp(1) },
  exploreSection: { marginTop: hp(2), paddingHorizontal: wp(4) },
  exploreHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hp(1.5) },
  exploreTitle: { fontSize: hp(2.6), fontWeight: "700", color: "#fff" },
  seeAll: { fontSize: hp(1.9), fontWeight: "500", color: theme.colors.primary },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", height: hp(20), borderRadius: 18, marginBottom: hp(2), overflow: "hidden" },
  cardGradient: { flex: 1, borderRadius: 18 },
  cardBlur: {
    flex: 1,
    padding: wp(4),
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "rgba(255,215,0,0.35)",
  },
  cardTitle: { marginTop: hp(1), fontSize: hp(2.1), fontWeight: "700", color: "#fff" },
  cardDesc: { fontSize: hp(1.7), color: "rgba(255,255,255,0.75)", lineHeight: hp(2.4) },
  holyBox: {
    marginVertical: 16,
    marginHorizontal: wp(4),
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  crossIcon: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 50, padding: 10, marginRight: 10 },
  crossInner: { width: 42, height: 42, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  holyTitle: { fontSize: 17, fontWeight: "700", color: "#fff" },
  holySubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  arrowPressable: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 50, padding: 10 },
  arrowInner: { width: 42, height: 42, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  floatingBottomNav: {
    position: "absolute",
    bottom: hp(3),
    left: wp(6),
    right: wp(6),
    height: hp(7.2),
    borderRadius: hp(3.6),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "hidden",
  },
  iconWrapper: { padding: 10, borderRadius: 30 },
  activeIconWrapper: { backgroundColor: "#fff", borderRadius: 30 },
});

export default MotivationScreen;
