import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
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

// ✅ Local theme fallback so no undefined errors
const theme = {
  colors: {
    white: "#FFFFFF",
    grayBG: "#F0F0F0",
    neutral: (opacity) => `rgba(0,0,0,${opacity})`,
  },
  fontWeights: {
    medium: "500",
    semibold: "600",
  },
  radius: {
    sm: 6,
    lg: 12,
  },
};

let page = 1;

const tabs = [
  { id: "home", icon: "home-outline", lib: Ionicons, route: "/" },
  { id: "heart", icon: "heart", lib: FontAwesome5, route: "/favourite" },
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

  const searchInputRef = useRef(null);
  const modelRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchImages();
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
        setImages((prev) => (append ? [...prev, ...formattedImages] : formattedImages));
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
    const params = text.length > 2 ? { page, q: text, ...filters } : { page, ...filters };
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
    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>Hello, John Doe</Text>
          <Text style={styles.welcomeText}>Welcome To Faith Frames</Text>
        </View>
        <Pressable onPress={() => router.push("/profile")}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://img.freepik.com/premium-photo/young-professional-man-suit-smiling_605022-20977.jpg",
              }}
              style={styles.profileImage}
            />
          </View>
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15, paddingBottom: hp(12) }}
      >
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={22}
            color={theme.colors.neutral(0.4)}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for Images"
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            value={search}
            style={styles.searchInput}
          />
          {search ? (
            <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
              <Ionicons name="close" size={20} color={theme.colors.neutral(0.6)} />
            </Pressable>
          ) : null}
        </View>

        {/* Image Stack */}
        <StackCard images={images} />
      </ScrollView>

      {/* Filter modal */}
      <FiltersModel
        modelRef={modelRef}
        filters={filters}
        setFilters={setFilters}
        onClose={() => modelRef?.current?.close()}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {/* Floating Bottom Navigation */}
      <View style={styles.floatingBottomNav}>
        {tabs.map(({ id, icon, lib: IconLib, route }) => {
          const isActive = activeTab === id;
          return (
            <Pressable
              key={id}
              style={styles.navItem}
              onPress={() => handleTabPress(id, route)}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIcon]}>
                <IconLib
                  name={icon}
                  size={24}
                  color={isActive ? "#000" : "#fff"}
                />
              </View>
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
  },
  userName: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.7),
  },
  welcomeText: {
    fontSize: hp(2.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  profileImageContainer: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: { marginRight: 6 },
  searchInput: {
    flex: 1,
    fontSize: hp(1.9),
    color: theme.colors.neutral(0.9),
    paddingVertical: 6,
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
    backgroundColor: "#000",
    borderRadius: hp(3.5),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
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


