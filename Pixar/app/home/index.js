// HomeScreen.js
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import StackCard from "../../components/StackCard";
import FiltersModel from "../../components/filterModals";
import { apiCall } from "../../api";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

// 🔥 Firebase
import { auth, db } from "../../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// 🎨 Theme
const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFD700",
    neutral: (opacity) => `rgba(255,255,255,${opacity})`,
  },
  fontWeights: {
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  radius: {
    sm: 6,
    lg: 12,
    xl: 20,
  },
};

// 📌 Tabs
const tabs = [
  { id: "home", icon: "home-outline", lib: Ionicons, route: "/" },
  { id: "lightbulb", icon: "lightbulb-outline", lib: Ionicons, route: "/motivation" },
  { id: "settings", icon: "settings-outline", lib: Ionicons, route: "/setting" },
  { id: "quiz", icon: "help-outline", lib: MaterialIcons, route: "/quiz" },
];

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 8 : 24;

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [isEndReached, setIsEndReached] = useState(false);
  const [user, setUser] = useState(null);

  const pageRef = useRef(1);
  const modelRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  // 🔥 Animations
  const headerAnim = useRef(new Animated.Value(-120)).current;
  const profileAnim = useRef(new Animated.Value(1)).current;
  const tabScale = useRef({}).current;

  // 👤 Load user from Firebase
  useEffect(() => {
    let unsubSnapshot = null;
    const unsubAuth = auth.onAuthStateChanged((u) => {
      if (!u) {
        setUser(null);
        if (unsubSnapshot) {
          unsubSnapshot();
          unsubSnapshot = null;
        }
        return;
      }
      try {
        const userDocRef = doc(db, "users", u.uid);
        unsubSnapshot = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            setUser(snap.data());
          } else {
            setUser({
              name: u.displayName || u.email || "User",
              photoURL: u.photoURL,
            });
          }
        });
      } catch {
        setUser({ name: u.displayName || u.email || "User", photoURL: u.photoURL });
      }
    });
    return () => {
      if (unsubSnapshot) unsubSnapshot();
      if (unsubAuth) unsubAuth();
    };
  }, []);

  // 🚀 Animate header + fetch
  useEffect(() => {
    fetchImages();
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 650,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // 📡 Fetch images
  const fetchImages = async (params = {}, append = true) => {
    try {
      const response = await apiCall(params);
      if (response?.success && Array.isArray(response.data)) {
        const formatted = response.data.map((item) => ({
          id: item._id,
          url: item.url,
          title: item.title,
        }));
        setImages((prev) => (append ? [...prev, ...formatted] : formatted));
      }
    } catch (err) {
      console.error("Image fetch error:", err);
    }
  };

  // 🔎 Debounced search
  const handleSearch = useCallback(
    (text) => {
      setSearch(text);
      pageRef.current = 1;
      setImages([]);
      let params = text.length > 2 ? { page: 1, q: text, ...filters } : { page: 1, ...filters };
      if (activeCategory) params.category = activeCategory;
      fetchImages(params, false);
    },
    [filters, activeCategory]
  );
  const handleTextDebounce = useMemo(() => debounce(handleSearch, 400), [handleSearch]);
  useEffect(() => () => handleTextDebounce.cancel(), [handleTextDebounce]);

  const applyFilters = () => {
    pageRef.current = 1;
    setImages([]);
    let params = { page: 1, ...filters };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
    modelRef?.current?.close?.();
  };

  const resetFilters = () => {
    pageRef.current = 1;
    setFilters(null);
    setImages([]);
    let params = { page: 1 };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
    modelRef?.current?.close?.();
  };

  const handleScroll = (event) => {
    const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent;
    const bottom = contentSize.height - layoutMeasurement.height;
    if (contentOffset.y >= bottom - 1 && !isEndReached) {
      setIsEndReached(true);
      pageRef.current += 1;
      let params = { page: pageRef.current, ...filters };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, true);
    } else if (contentOffset.y < bottom - 1 && isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleTabPress = (tabId, route) => {
    setActiveTab(tabId);
    if (!tabScale[tabId]) tabScale[tabId] = new Animated.Value(1);
    Animated.sequence([
      Animated.spring(tabScale[tabId], { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(tabScale[tabId], { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    router.push(route);
  };

  return (
    <LinearGradient colors={["#001400", "#000"]} style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop }]}>
        {/* Header with glass effect */}
        <Animated.View style={[styles.header, { transform: [{ translateY: headerAnim }] }]}>
          <BlurView intensity={60} tint="dark" style={styles.headerBlur}>
            <View style={{ flexShrink: 1, marginRight: 12 }}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name ? `Hello, ${user.name}` : "Hello, Guest"}
              </Text>
              <Text style={styles.welcomeText}>Welcome To Faith Frames</Text>
            </View>
            <Pressable
              onPressIn={() =>
                Animated.spring(profileAnim, { toValue: 0.92, useNativeDriver: true }).start()
              }
              onPressOut={() =>
                Animated.spring(profileAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start()
              }
              onPress={() => router.push("/profile")}
            >
              <Animated.View style={[styles.profileImageContainer, { transform: [{ scale: profileAnim }] }]}>
                <Image
                  source={
                    user?.photoURL
                      ? { uri: user.photoURL }
                      : require("../../assets/images/imagea.png")
                  }
                  style={styles.profileImage}
                />
              </Animated.View>
            </Pressable>
          </BlurView>
        </Animated.View>

        {/* Content */}
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollRef}
          contentContainerStyle={{
            flexGrow: 1,
            gap: 15,
            paddingBottom: hp(10),
            paddingHorizontal: wp(3),
          }}
        >
          <StackCard images={images} fadeIn />
        </ScrollView>

        {/* Filters */}
        <FiltersModel
          modelRef={modelRef}
          filters={filters}
          setFilters={setFilters}
          onClose={() => modelRef?.current?.close?.()}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {/* Bottom Nav */}
        <LinearGradient
          colors={["#00ff87", "#FFD700"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingBottomNav}
        >
          {tabs.map(({ id, icon, lib: IconLib, route }) => {
            const isActive = activeTab === id;
            if (!tabScale[id]) tabScale[id] = new Animated.Value(1);
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
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginHorizontal: wp(3),
    marginBottom: hp(1.5),
    borderRadius: 14,
    overflow: "hidden",
  },
  headerBlur: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.6),
  },
  userName: {
    fontSize: hp(1.9),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.white,
  },
  welcomeText: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  },
  profileImageContainer: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: { shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 6 },
    }),
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
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
    paddingHorizontal: wp(2),
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 8 },
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

export default HomeScreen;
