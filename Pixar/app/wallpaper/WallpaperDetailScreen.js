import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Share,
  Image,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { colors } from '../theme/colors';
import { fontSize, HP, WP } from '../theme/scale';
import TopBar from '../../components/TopBar';
import CustomBottomsheet from '../../components/CustomBottomsheet';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SnackbarUtils from '../utils/SnackbarUtils';
import ProgressOpacity from '../quiz/ProgressOpacity';
import { commonStyles } from '../utils/commonStyles';

const { WallpaperManager } = NativeModules;

const WallpaperDetailScreen = ({ route }) => {
  const { item } = route.params;
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
      SnackbarUtils.showError('Failed to share wallpaper');
    }
  };

  const handleSetAsWallpaper = () => {
    setBottomSheetVisible(true);
  };

  const handleWallpaperOption = async option => {
    setBottomSheetVisible(false);
    setIsSettingWallpaper(true);

    let wallpaperType;
    switch (option) {
      case 'Home Screen':
        wallpaperType = 'home';
        break;
      case 'Lock Screen':
        wallpaperType = 'lock';
        break;
      case 'Both':
        wallpaperType = 'both';
        break;
      default:
        wallpaperType = 'home';
    }

    try {
      const result = await WallpaperManager.setWallpaper(
        item.uri,
        wallpaperType,
      );
      setIsSettingWallpaper(false);

      if (result.status === 'success') {
        SnackbarUtils.showInfo(result.message);
      } else {
        SnackbarUtils.showError(result.message);
      }
    } catch (error) {
      setIsSettingWallpaper(false);
      SnackbarUtils.showError('Failed to set wallpaper: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title={item.title} />
      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Wallpaper Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.wallpaperImage} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title and Description */}
            <View style={styles.titleSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                  <Icon
                    name="HeartIcon"
                    size={fontSize(30)}
                    color={isFavorite ? colors.favourite : colors.dark}
                    variant={isFavorite ? 'solid' : 'outline'}
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
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Animated.View
        entering={FadeInDown.delay(300).duration(700).springify()}
        style={styles.actionButtons}
      >
        {/* Use ProgressOpacity for Share button */}
        <ProgressOpacity
          style={[commonStyles.secondaryBtn, { flex: 1 }]}
          txtStyle={{ color: colors.dark }}
          onPress={handleShare}
          title="Share"
        />
        <ProgressOpacity
          style={[commonStyles.primaryBtn, { flex: 4 }]}
          onPress={handleSetAsWallpaper}
          title="Apply"
        />
      </Animated.View>
      <CustomBottomsheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title="Set Wallpaper"
      >
        <View style={styles.sheetOptions}>
          <ProgressOpacity
            style={commonStyles.primaryBtn}
            onPress={() => handleWallpaperOption('Home Screen')}
            title="Set as Home Screen"
          />
          <ProgressOpacity
            style={commonStyles.primaryBtn}
            onPress={() => handleWallpaperOption('Lock Screen')}
            title="Set as Lock Screen"
          />
          <ProgressOpacity
            style={commonStyles.primaryBtn}
            onPress={() => handleWallpaperOption('Both')}
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
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  imageContainer: {
    marginHorizontal: WP(5),
    marginBottom: HP(2),
  },
  wallpaperImage: {
    width: '100%',
    height: HP(60),
    borderRadius: WP(4),
  },
  content: {
    paddingHorizontal: WP(5),
    paddingBottom: HP(3),
  },
  titleSection: {
    marginBottom: HP(3),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HP(1),
  },
  title: {
    fontSize: fontSize(24),
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
  },
  location: {
    fontSize: fontSize(16),
    color: colors.placeholder,
    marginBottom: HP(1.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WP(1),
  },
  ratingText: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: colors.dark,
  },
  reviewsText: {
    fontSize: fontSize(14),
    color: colors.placeholder,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: WP(3),
    marginHorizontal: WP(5),
    marginBottom: HP(2),
  },
  sheetOptions: {
    gap: HP(2),
  },
});
