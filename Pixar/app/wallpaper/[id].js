// E:\2025\Freelance\Faith-Frames\Pixar\app\wallpaper\[id].js
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Image,
  NativeModules,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../../components/Icon";
import { colors } from "../theme/colors";
import { fontSize, HP, WP } from "../theme/scale";
import TopBar from "../../components/TopBar";
import CustomBottomsheet from "../../components/CustomBottomsheet";
import Animated, { FadeInDown } from "react-native-reanimated";
import SnackbarUtils from "../utils/SnackbarUtils";
import ProgressOpacity from "../quiz/ProgressOpacity";
import { commonStyles } from "../utils/commonStyles";

// Safe access to WallpaperManager native module with fallback
const WallpaperManager = NativeModules.WallpaperManager || {
  setWallpaper: async (uri, type) => {
    // Fallback: Use expo-sharing to let user save the image
    const { shareAsync } = await import('expo-sharing');
    const { downloadAsync, cacheDirectory } = await import('expo-file-system');
    
    try {
      // Download image to cache
      const fileUri = `${cacheDirectory}wallpaper_${Date.now()}.jpg`;
      const downloadResult = await downloadAsync(uri, fileUri);
      
      // Share the image so user can set it manually
      await shareAsync(downloadResult.uri);
      
      return {
        status: 'success',
        message: 'Please use your device\'s image viewer to set as wallpaper',
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Wallpaper feature not available. Please use your device\'s image viewer.',
      };
    }
  },
};

const WallpaperDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // unpack item data with safe defaults
  const item = {
    id: params.id ?? "",
    title: params.title ?? "Wallpaper",
    uri: params.uri ?? "",
    location: params.location ?? "Unknown",
    country: params.country ?? "",
    rating: params.rating ? parseFloat(params.rating) : 0,
    reviews: params.reviews ? parseInt(params.reviews) : 0,
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isSettingWallpaper, setIsSettingWallpaper] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing wallpaper: ${item.title} from ${item.location}, ${item.country}`,
        url: item.uri,
      });
    } catch (error) {
      SnackbarUtils.showError("Failed to share wallpaper");
    }
  };

  const handleSetAsWallpaper = () => {
    if (!item.uri) {
      SnackbarUtils.showError("Invalid wallpaper URI");
      return;
    }
    setBottomSheetVisible(true);
  };

  const handleWallpaperOption = async (option) => {
    setBottomSheetVisible(false);
    setIsSettingWallpaper(true);

    let wallpaperType;
    switch (option) {
      case "Home Screen":
        wallpaperType = "home";
        break;
      case "Lock Screen":
        wallpaperType = "lock";
        break;
      case "Both":
        wallpaperType = "both";
        break;
      default:
        wallpaperType = "home";
    }

    try {
      const result = await WallpaperManager.setWallpaper(item.uri, wallpaperType);
      setIsSettingWallpaper(false);

      if (result?.status === "success") {
        SnackbarUtils.showInfo(result.message || "Wallpaper option opened");
      } else {
        SnackbarUtils.showError(result?.message || "Failed to apply wallpaper");
      }
    } catch (error) {
      setIsSettingWallpaper(false);
      // Fallback: Try using expo-sharing
      try {
        const { shareAsync } = await import('expo-sharing');
        await shareAsync(item.uri);
        SnackbarUtils.showInfo("Please use your device's image viewer to set as wallpaper");
      } catch (shareError) {
        SnackbarUtils.showError("Wallpaper feature not available. Please use your device's image viewer.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title={item.title} onBack={() => router.back()} />

      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Wallpaper Image */}
          <View style={styles.imageContainer}>
            {item.uri ? (
              <Image source={{ uri: item.uri }} style={styles.wallpaperImage} />
            ) : (
              <View style={[styles.wallpaperImage, styles.imagePlaceholder]}>
                <Text style={{ color: colors.placeholder }}>No Image</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title and Favorite */}
            <View style={styles.titleSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                  <Icon
                    name="HeartIcon"
                    size={fontSize(30)}
                    color={isFavorite ? colors.favourite : colors.dark}
                    variant={isFavorite ? "solid" : "outline"}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.location}>
                {item.location}, {item.country}
              </Text>

              {/* Rating */}
              <View style={styles.ratingContainer}>
                <Icon
                  name="StarIcon"
                  size={fontSize(20)}
                  color={colors.dark}
                  variant="outline"
                />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                <Text style={styles.reviewsText}>
                  ({item.reviews} reviews)
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(700).springify()}
        style={styles.actionButtons}
      >
        <ProgressOpacity
          style={[commonStyles.secondaryBtn, { flex: 1 }]}
          txtStyle={{ color: colors.dark }}
          onPress={handleShare}
          title="Share"
        />
        <ProgressOpacity
          style={[commonStyles.primaryBtn, { flex: 4 }]}
          onPress={handleSetAsWallpaper}
          title={isSettingWallpaper ? "Applying..." : "Apply"}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <CustomBottomsheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title="Set Wallpaper"
      >
        <View style={styles.sheetOptions}>
          <ProgressOpacity
            style={commonStyles.primaryBtn}
            onPress={() => handleWallpaperOption("Home Screen")}
            title="Set as Home Screen"
          />
          <ProgressOpacity
            style={commonStyles.primaryBtn}
            onPress={() => handleWallpaperOption("Lock Screen")}
            title="Set as Lock Screen"
          />
          <ProgressOpacity
            style={commonStyles.primaryBtn}
            onPress={() => handleWallpaperOption("Both")}
            title="Set Both"
            txtStyle={styles.sheetButtonText}
          />
        </View>
      </CustomBottomsheet>
    </View>
  );
};

export default WallpaperDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1 },
  imageContainer: {
    marginHorizontal: WP(5),
    marginBottom: HP(2),
  },
  wallpaperImage: {
    width: "100%",
    height: HP(60),
    borderRadius: WP(4),
  },
  imagePlaceholder: {
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: WP(5),
    paddingBottom: HP(3),
  },
  titleSection: { marginBottom: HP(3) },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: HP(1),
  },
  title: {
    fontSize: fontSize(24),
    fontWeight: "700",
    color: colors.dark,
    flex: 1,
  },
  location: {
    fontSize: fontSize(16),
    color: colors.placeholder,
    marginBottom: HP(1.5),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: WP(1),
  },
  ratingText: {
    fontSize: fontSize(14),
    fontWeight: "600",
    color: colors.dark,
  },
  reviewsText: {
    fontSize: fontSize(14),
    color: colors.placeholder,
  },
  actionButtons: {
    flexDirection: "row",
    gap: WP(3),
    marginHorizontal: WP(5),
    marginBottom: HP(2),
  },
  sheetOptions: { gap: HP(2) },
  sheetButtonText: { color: colors.white },
});




