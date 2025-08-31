import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../../helpers/common";

import imageC from "../../assets/images/image.png";
import imageA from "../../assets/images/imagea.png";
import imageB from "../../assets/images/imageb.jpg";

const { width } = Dimensions.get("window");
const cardSize = width / 2 - 30;

const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFFFFF",
    premiumBlack: "#1A1A1A",
    grayBG: "#F5F5F5",
    neutral: (opacity) => `rgba(0,0,0,${opacity})`,
  },
};

const images = [imageC, imageA, imageB];

const cards = [
  { id: 1, title: "Daily Verse", icon: "book-outline", route: "motivation/daily-verse" },
  { id: 2, title: "Daily Prayers", icon: "hand-left-outline", route: "motivation/daily-prayers" },
  { id: 3, title: "God's Words", icon: "heart-outline", route: "motivation/gods-words" },
  { id: 4, title: "The Witness", icon: "people-outline", route: "motivation/witness" },
];


const MotivationScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header with gradient (now pure white) */}
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF"]}
        style={styles.header}
      >
        <Pressable onPress={() => router.push("/home")}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={theme.colors.white} />
          </View>
        </Pressable>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Stay Motivated</Text>
          <Text style={styles.subText}>Your daily dose of inspiration</Text>
        </View>
      </LinearGradient>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image source={item} style={styles.carouselImage} />
            </View>
          )}
        />
        {/* Pagination Dots */}
        <View style={styles.dotsWrapper}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { opacity: i === activeIndex ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Premium Cards */}
      <View style={styles.cardsContainer}>
        {cards.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.cardWrapper}
            activeOpacity={0.8}
            onPress={() => router.push(item.route)}
          >
            <LinearGradient
              colors={["#222", "#111"]}
              style={styles.card}
            >
              <Ionicons
                name={item.icon}
                size={46}
                color={theme.colors.primary} // ✅ now white
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{item.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  backButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: theme.colors.black,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  welcomeContainer: { marginLeft: wp(4) },
  welcomeText: {
    fontSize: hp(2.6),
    fontWeight: "700",
    color: theme.colors.black,
  },
  subText: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.7),
  },

  // Carousel
  carouselContainer: { marginTop: 20, height: 220 },
  imageWrapper: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: width * 0.9,
    height: 160,
    resizeMode: "cover",
    borderRadius: 15,
    backgroundColor: "#eee",
    elevation: 4,
  },
  dotsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.black,
    marginHorizontal: 5,
  },

  // Cards
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  cardWrapper: {
    width: cardSize,
    height: cardSize,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFFFFF", // ✅ shadow now white
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  cardIcon: {
    textShadowColor: "rgba(255,255,255,0.8)", // ✅ glow now white
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  cardText: {
    marginTop: 8,
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default MotivationScreen;

