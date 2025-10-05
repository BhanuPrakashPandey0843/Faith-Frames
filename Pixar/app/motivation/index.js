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
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";

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

const tabs = [
  { id: "home", icon: "home-outline", lib: Ionicons, route: "/" },
  {
    id: "lightbulb",
    icon: "lightbulb",
    lib: FontAwesome5,
    route: "/motivation/MotivationScreen",
  },
  { id: "settings", icon: "settings-outline", lib: Ionicons, route: "/setting" },
  { id: "quiz", icon: "help-outline", lib: MaterialIcons, route: "/quiz" },
];

const MotivationScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const profileAnim = useRef(new Animated.Value(1)).current;
  const tabScale = useRef({}).current;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lightbulb");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
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
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
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

  return (
    <LinearGradient colors={["#001400", "#000"]} style={{ flex: 1, paddingTop }}>
      {/* ✅ HEADER */}
      <BlurView intensity={60} tint="dark" style={styles.header}>
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
            <Image
              source={
                userData?.photoURL
                  ? { uri: userData.photoURL }
                  : require("../../assets/images/imagea.png")
              }
              style={styles.profileImage}
            />
          </Animated.View>
        </Pressable>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ✅ HERO SECTION */}
        <Animated.View
          style={[
            styles.heroContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.subtitle}>Meet Faith Frames</Text>
          <Text style={styles.title}>Sacred Pathways{"\n"}Begin Here</Text>
        </Animated.View>

        {/* ✅ EXPLORE SECTION */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreHeader}>
            <Text style={styles.exploreTitle}>Explore</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <View style={styles.cardGrid}>
            {[
              {
                icon: "book-outline",
                title: "Daily Verse",
                desc: "Scripture daily, soul steady.",
                route: "/motivation/daily-verse",
              },
              {
                icon: "hand-left-outline",
                title: "Daily Prayer",
                desc: "One prayer, endless strength.",
                route: "/motivation/daily-prayers",
              },
              {
                icon: "bookmarks-outline",
                title: "God's Word",
                desc: "Strength comes from His Word.",
                route: "/motivation/gods-words",
              },
              {
                icon: "people-outline",
                title: "The Witness",
                desc: "Your life is testimony.",
                route: "/motivation/witness",
              },
            ].map((item, index) => (
              <Pressable key={index} style={styles.card} onPress={() => router.push(item.route)}>
                <LinearGradient
                  colors={["rgba(255,215,0,0.15)", "rgba(0,255,135,0.1)"]}
                  style={styles.cardGradient}
                >
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

        {/* ✅ MOTIVATION BOX */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.motivationBox}
        >
          <Text style={styles.motivationTitle}>Holy Connect</Text>
          <Text style={styles.motivationSubtitle}>
            Connect with God in real time—pray, listen, and receive.
          </Text>
        </LinearGradient>
      </ScrollView>

      {/* ✅ BOTTOM NAVIGATION */}
      <LinearGradient
        colors={["#00ff87", "#FFD700"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.floatingBottomNav}
      >
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
                <IconLib
                  name={icon}
                  size={23}
                  color={isActive ? theme.colors.black : "#fff"}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: 16,
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    overflow: "hidden",
  },
  welcomeText: {
    fontSize: hp(2.3),
    fontWeight: "600",
    color: theme.colors.white,
  },
  profileImageContainer: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(3),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },

  /** ✅ HERO SECTION */
  heroContainer: {
    alignItems: "flex-start",
    marginVertical: hp(4),
    paddingHorizontal: wp(6),
  },
  title: {
    fontSize: hp(3.8),
    fontWeight: "800",
    color: theme.colors.white,
    textAlign: "left",
    textShadowColor: "rgba(255,215,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: hp(2.3),
    color: "rgba(255,255,255,0.8)",
    marginBottom: hp(1),
    textAlign: "left",
    letterSpacing: 1,
  },

  /** ✅ EXPLORE SECTION */
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
    color: theme.colors.white,
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
    height: hp(20),
    borderRadius: 18,
    marginBottom: hp(2),
    overflow: "hidden",
  },
  cardGradient: { flex: 1, borderRadius: 18 },
  cardBlur: {
    flex: 1,
    padding: wp(4),
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,215,0,0.4)",
  },
  cardTitle: {
    marginTop: hp(1),
    fontSize: hp(2.1),
    fontWeight: "700",
    color: theme.colors.white,
  },
  cardDesc: {
    fontSize: hp(1.8),
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
  },
  motivationBox: {
    margin: wp(4),
    borderRadius: 22,
    padding: wp(6),
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  motivationTitle: {
    fontSize: hp(2.8),
    fontWeight: "700",
    color: theme.colors.black,
    marginBottom: hp(0.5),
  },
  motivationSubtitle: {
    fontSize: hp(2),
    color: "rgba(0,0,0,0.7)",
  },
  floatingBottomNav: {
    position: "absolute",
    bottom: hp(2.2),
    left: wp(6),
    right: wp(6),
    height: hp(7),
    borderRadius: hp(3.5),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 8,
      },
      android: { elevation: 10 },
    }),
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 30,
  },
  activeIconWrapper: {
    backgroundColor: "#fff",
    borderRadius: 30,
  },
});

export default MotivationScreen;


