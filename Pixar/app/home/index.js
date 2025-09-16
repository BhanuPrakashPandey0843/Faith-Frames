// HomeScreen.js
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { debounce } from "lodash";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import StackCard from "../../components/StackCard";
import FiltersModel from "../../components/filterModals";
import { apiCall } from "../../api";

// 🔥 Firebase
import { auth, db } from "../../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// 🎨 Theme
const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFD700",
    grayBG: "#F5F5F5",
    neutral: (opacity) => `rgba(0,0,0,${opacity})`,
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
  { id: "lightbulb", icon: "lightbulb", lib: FontAwesome5, route: "/motivation" },
  { id: "settings", icon: "settings-outline", lib: Ionicons, route: "/setting" },
  { id: "quiz", icon: "help-outline", lib: MaterialIcons, route: "/quiz" },
];

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [isEndReached, setIsEndReached] = useState(false);
  const [user, setUser] = useState(null);

  const pageRef = useRef(1);
  const searchInputRef = useRef(null);
  const modelRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  // 🔥 Animations
  const searchAnim = useRef(new Animated.Value(-50)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const profileAnim = useRef(new Animated.Value(1)).current;
  const tabScale = useRef({}).current;

  // 👤 Load user from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
      if (snap.exists()) {
        setUser(snap.data());
      } else {
        setUser({
          name: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
        });
      }
    });
    return unsub;
  }, []);

  // 🚀 Animate header + search
  useEffect(() => {
    fetchImages();
    Animated.parallel([
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 📡 Fetch images
  const fetchImages = async (params = {}, append = true) => {
    try {
      const response = await apiCall(params);
      if (response.success && Array.isArray(response.data)) {
        const formattedImages = response.data.map((item) => ({
          id: item._id,
          url: item.url,
          title: item.title,
        }));
        setImages((prev) =>
          append ? [...prev, ...formattedImages] : formattedImages
        );
      }
    } catch (err) {
      console.error("Image fetch error:", err);
    }
  };

  // 🔎 Handle search with debounce
  const handleSearch = useCallback(
    (text) => {
      setSearch(text);
      pageRef.current = 1;
      setImages([]);
      let params =
        text.length > 2 ? { page: pageRef.current, q: text, ...filters } : { page: pageRef.current, ...filters };
      if (activeCategory) params.category = activeCategory;
      fetchImages(params, false);
    },
    [filters, activeCategory]
  );

  const handleTextDebounce = useMemo(
    () => debounce(handleSearch, 400),
    [handleSearch]
  );

  const applyFilters = () => {
    pageRef.current = 1;
    setImages([]);
    let params = { page: pageRef.current, ...filters };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
    modelRef?.current?.close();
  };

  const resetFilters = () => {
    pageRef.current = 1;
    setFilters(null);
    setImages([]);
    let params = { page: pageRef.current };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
    modelRef?.current?.close();
  };

  const handleScroll = (event) => {
    const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent;
    const bottomPosition = contentSize.height - layoutMeasurement.height;

    if (contentOffset.y >= bottomPosition - 1 && !isEndReached) {
      setIsEndReached(true);
      pageRef.current += 1;
      let params = { page: pageRef.current, ...filters };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, true);
    } else if (contentOffset.y < bottomPosition - 1 && isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleTabPress = (tabId, route) => {
    setActiveTab(tabId);
    if (!tabScale[tabId]) tabScale[tabId] = new Animated.Value(1);

    Animated.sequence([
      Animated.spring(tabScale[tabId], { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(tabScale[tabId], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerAnim }] }]}>
        <View style={{ flexShrink: 1 }}>
          <Text
            style={styles.userName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Hello, {user?.name || "Guest"}
          </Text>
          <Text style={styles.welcomeText}>Welcome To Faith Frames</Text>
        </View>
        <Pressable
          onPressIn={() =>
            Animated.spring(profileAnim, { toValue: 0.9, useNativeDriver: true }).start()
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
      </Animated.View>

      {/* Content */}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 15,
          paddingBottom: hp(12),
        }}
      >
     
        <StackCard images={images} fadeIn />
      </ScrollView>

      <FiltersModel
        modelRef={modelRef}
        filters={filters}
        setFilters={setFilters}
        onClose={() => modelRef?.current?.close()}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {/* Bottom Nav */}
      <View style={styles.floatingBottomNav}>
        {tabs.map(({ id, icon, lib: IconLib, route }) => {
          const isActive = activeTab === id;
          if (!tabScale[id]) tabScale[id] = new Animated.Value(1);

          return (
            <Pressable key={id} onPress={() => handleTabPress(id, route)}>
              <Animated.View
                style={[
                  styles.iconWrapper,
                  isActive && styles.activeIcon,
                  { transform: [{ scale: tabScale[id] }] },
                ]}
              >
                <IconLib
                  name={icon}
                  size={24}
                  color={isActive ? theme.colors.primary : "#fff"}
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
  container: { flex: 1, backgroundColor: theme.colors.grayBG },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.6),
  },
  welcomeText: {
    fontSize: hp(2.6),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.black,
  },
  profileImageContainer: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 6 },
    }),
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: wp(4),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  searchIcon: { marginRight: 6 },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: theme.colors.neutral(0.9),
  },
  closeIcon: {
    backgroundColor: theme.colors.grayBG,
    padding: 6,
    borderRadius: theme.radius.sm,
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
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
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
  activeIcon: {
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
