// app/favourite/index.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import Icon from "../../components/Icon";

import { colors } from "../theme/colors";
import { fontSize, HP, WP } from "../theme/scale";
import { data } from "../data/images";

const FavouriteScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) newFavorites.delete(id);
    else newFavorites.add(id);
    setFavorites(newFavorites);
  };

  const renderItem = ({ item, index }) => {
    const isFavorite = favorites.has(item.id);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(700).springify()}
      >
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() =>
            router.push({
              pathname: "/wallpaper/[id]",
              params: { ...item },
            })
          }
        >
          <ImageBackground
            source={{ uri: item.uri }}
            style={styles.imageBackground}
          >
            {/* Favorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Icon
                name="HeartIcon"
                size={20}
                color={isFavorite ? colors.favourite : colors.white}
                variant={isFavorite ? "solid" : "outline"}
              />
            </TouchableOpacity>

            {/* Overlay Info */}
            <View style={styles.overlay}>
              <Text style={styles.titleText} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}, {item.country}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#1a1a1a", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.glowBorder} />

      {/* 🌟 Heading Section */}
      <Animated.View entering={FadeInDown.delay(100).duration(800).springify()}>
        <Text style={styles.pageTitle}>Favourite Wallpapers</Text>
        <View style={styles.headingUnderline} />
      </Animated.View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {favorites.size === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You have no favorite wallpapers yet!
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingTop: HP(6),
  },
  glowBorder: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: 0,
    shadowColor: colors.primary || "#ff6f61",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  pageTitle: {
    fontSize: fontSize(20),
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "#ff6f61",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headingUnderline: {
    width: WP(20),
    height: 3,
    backgroundColor: "#ff6f61",
    alignSelf: "center",
    marginTop: HP(1),
    borderRadius: 2,
  },
  listContainer: {
    paddingHorizontal: WP(3),
    paddingBottom: HP(3),
    marginTop: HP(3),
  },
  row: {
    justifyContent: "space-between",
  },
  itemContainer: {
    width: WP(45),
    height: HP(30),
    marginBottom: WP(3),
    borderRadius: WP(3),
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#ff6f61",
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  favoriteButton: {
    position: "absolute",
    top: WP(3),
    right: WP(3),
    width: WP(8),
    height: WP(8),
    borderRadius: WP(4),
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: WP(3),
    marginTop: "auto",
    borderBottomLeftRadius: WP(3),
    borderBottomRightRadius: WP(3),
  },
  titleText: {
    color: colors.white,
    fontSize: fontSize(16),
    fontWeight: "600",
    marginBottom: HP(0.5),
  },
  locationText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: fontSize(12),
  },
  emptyContainer: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
  },
  emptyText: {
    fontSize: fontSize(16),
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
});
