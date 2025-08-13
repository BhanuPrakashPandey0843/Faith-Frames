// Pixar\app\home\index.js
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Image,
  } from "react-native";
  import React, { useCallback, useEffect, useRef, useState } from "react";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
  import { theme } from "../../constants/theme";
  import { hp, wp } from "../../helpers/common";
  import Catagories from "../../components/categories";
  import { apiCall } from "../../api";
  import ImageGrid from "../../components/imagegrid";
  import FiltersModel from "../../components/filterModals";
  import StackCard from "../../components/StackCard"; 
 
  import { debounce, set } from "lodash";
  import { useRouter } from "expo-router";
  
  var page = 1;
  
  const HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState("");
    const [images, setImages] = useState([]);
    const [filters, setFilters] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const searchInputRef = useRef(null);
    const modelRef = useRef(null);
    const scrollRef = useRef(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      fetchImages();
    }, []);
  
    const fetchImages = async (params = {}, append = true) => {
  console.log("params: ", params, append);
  let response = await apiCall(params);
  if (response.success && Array.isArray(response.data)) {
    const formattedImages = response.data.map(item => ({
      id: item._id,
      url: item.url,
      title: item.title,
    }));

    if (append) {
      setImages(prev => [...prev, ...formattedImages]);
    } else {
      setImages(formattedImages);
    }
  }
};

  
    const handleChangeCategory = (category) => {
      setActiveCategory(category);
      clearSearch();
      setImages([]);
      page = 1;
      let params = { page, ...filters };
      if (category) params.category = category;
      fetchImages(params, false);
    };
  
    const handleSearch = (text) => {
      setSearch(text);
      if (text.length > 2) {
        //search for this text
        page = 1;
        setImages([]);
        setActiveCategory(null); // clear category when searching
        fetchImages({ page, q: text, ...filters }, false);
      }
  
      if (text == "") {
        page = 1;
        searchInputRef?.current?.clear();
        setImages([]);
        setActiveCategory(null); // clear category when searching
        fetchImages({ page, ...filters }, false);
      }
    };
  
    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  
    const clearSearch = () => {
      setSearch("");
    };
  
    const openFilterModal = () => {
      modelRef?.current?.present();
    };
  
    const closeFilterModal = () => {
      modelRef?.current?.close();
    };
  
    const applyFilters = () => {
      if (filters) {
        page = 1;
        setImages([]);
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);
      }
      closeFilterModal();
    };
  
    const resetFilters = () => {
      if (filters) {
        page = 1;
        setFilters(null);
        setImages([]);
        let params = {
          page,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);
      }
      closeFilterModal();
    };
  
    const clearThisFilter = (filterName) => {
      let newFilters = { ...filters };
      delete newFilters[filterName];
      setFilters({ ...newFilters });
      page = 1;
      setImages([]);
      let params = {
        page,
        ...newFilters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params);
    };
  
    const handleScrollUp = () => {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    };
  
    const handleScroll = (event) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const scrollOffset = event.nativeEvent.contentOffset.y;
      const bottomPosition = contentHeight - scrollViewHeight;
  
      if (scrollOffset >= bottomPosition - 1) {
        if (!isEndReached) {
          setIsEndReached(true);
          console.log("reach to the bottom");
          // fetch more images
          ++page;
          let params = { page, ...filters };
          if (activeCategory) params.category = activeCategory;
          if (search) params.q = search;
          fetchImages(params, true);
        }
      } else if (isEndReached) { 
        setIsEndReached(false);
      }
    };
  
    return (
      <View style={[styles.container, { paddingTop }]}>
        
   {/* header */}
<View style={styles.header}>
  <View>
    <Text style={styles.userName}>Hello, John Doe</Text>
    <Text style={styles.welcomeText}>Welcome To Faith Frames</Text>
  </View>
  <Pressable onPress={() => console.log("Profile tapped")}>
    <View style={styles.profileImageContainer}>
      <Image
        source={{ uri: "https://img.freepik.com/premium-photo/young-professional-man-suit-smiling_605022-20977.jpg" }} // Replace with actual user image URL
        style={styles.profileImage}
      />
    </View>
  </Pressable>
</View>

  
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={5} // how often we should listen to scroll events
          ref={scrollRef}
          contentContainerStyle={{ gap: 15 }}
        >
          {/* search bar */}
          <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
              <Feather
                name="search"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </View>
            <TextInput
              placeholder="Search for Images"
              // value={search}
              ref={searchInputRef}
              onChangeText={handleTextDebounce}
              style={styles.searchInput}
            />
            {search && (
              <Pressable
                onPress={() => handleSearch("")}
                style={styles.closeIcon}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.neutral(0.6)}
                />
              </Pressable>
            )}
          </View>
         <StackCard />
        
        </ScrollView>
       
  
        {/* filter model */}
        <FiltersModel
          modelRef={modelRef}
          filters={filters}
          setFilters={setFilters}
          onClose={closeFilterModal}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </View>
    );
  };
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
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
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
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
  searchIcon: {
    paddingRight: 6,
  },
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
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
    marginTop: hp(1),
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.grayBG,
    borderRadius: 50, // pill shape
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
  },
  filterItemText: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.8),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 50,
  },
});export default HomeScreen;



