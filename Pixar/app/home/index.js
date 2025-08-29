import React, { useCallback, useEffect, useRef, useState } from "react";
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

// 🔥 import Firebase
import { auth, db } from "../../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";

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

let page = 1;

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

  // 🔥 user state
  const [user, setUser] = useState(null);

  const searchInputRef = useRef(null);
  const modelRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  // 🔥 Animations
  const searchAnim = useRef(new Animated.Value(-50)).current;
  const profileAnim = useRef(new Animated.Value(1)).current;
  const tabScale = useRef({}).current;

  // 👤 Load user from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
      if (snap.exists()) {
        setUser(snap.data());
      } else {
        // fallback to Firebase Auth
        setUser({
          name: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
        });
      }
    });
    return unsub;
  }, []);

  // Load images
  useEffect(() => {
    fetchImages();
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleSearch = (text) => {
    setSearch(text);
    page = 1;
    setImages([]);
    setActiveCategory(null);
    const params =
      text.length > 2 ? { page, q: text, ...filters } : { page, ...filters };
    fetchImages(params, false);
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const applyFilters = () => {
    page = 1;
    setImages([]);
    let params = { page, ...filters };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
    modelRef?.current?.close();
  };

  const resetFilters = () => {
    page = 1;
    setFilters(null);
    setImages([]);
    let params = { page };
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
      page++;
      let params = { page, ...filters };
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
      Animated.timing(tabScale[tabId], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(tabScale[tabId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>
            Hello, {user?.name || "Guest"}
          </Text>
          <Text style={styles.welcomeText}>Welcome To Faith Frames</Text>
        </View>
        <Pressable
          onPressIn={() =>
            Animated.spring(profileAnim, {
              toValue: 0.9,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.spring(profileAnim, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }).start()
          }
          onPress={() => router.push("/profile")}
        >
          <Animated.View
            style={[
              styles.profileImageContainer,
              { transform: [{ scale: profileAnim }] },
            ]}
          >
            <Image
              source={{
                uri:
                  user?.photoURL ||
                  "https://placehold.co/200x200?text=Avatar",
              }}
              style={styles.profileImage}
            />
          </Animated.View>
        </Pressable>
      </View>

      {/* Rest of your code unchanged... */}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{
          gap: 15,
          paddingBottom: hp(12),
          backgroundColor: theme.colors.grayBG,
        }}
      >
        <Animated.View style={{ transform: [{ translateY: searchAnim }] }}>
          <View style={styles.searchBar}>
            <Feather
              name="search"
              size={22}
              color={theme.colors.neutral(0.4)}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search for Images..."
              ref={searchInputRef}
              onChangeText={handleTextDebounce}
              value={search}
              style={styles.searchInput}
            />
            {search ? (
              <Pressable
                onPress={() => handleSearch("")}
                style={styles.closeIcon}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.colors.neutral(0.6)}
                />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>

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
                  color={isActive ? theme.colors.black : "#fff"}
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
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: "#fff",
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
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 30,
  },
  activeIcon: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
});

export default HomeScreen;
