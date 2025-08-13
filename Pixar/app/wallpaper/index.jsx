import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { data } from '../data/images';
import Icon from '../../components/Icon';
import { colors } from '../theme/colors';
import { fontSize, HP, WP } from '../theme/scale';
import { useNavigation } from '@react-navigation/native';
import { ScreenConstants } from '../utils/constant';
import TopBar from '../../components/TopBar';
import Animated, { FadeInDown } from 'react-native-reanimated';

const WallpaperListScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = id => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const renderWallpaperItem = ({ item, index }) => {
    const isFavorite = favorites.has(item.id);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(700)
          .springify()
        }
      >
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate(ScreenConstants.WALLPAPER_DETAIL_SCREEN, {
              item,
            })
          }
        >
          <ImageBackground source={{ uri: item.uri }} style={styles.imageStyle}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Icon
                name="HeartIcon"
                size={20}
                color={isFavorite ? colors.favourite : colors.white}
                variant={isFavorite ? 'solid' : 'outline'}
              />
            </TouchableOpacity>

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
    <FlatList
      data={data}
      renderItem={renderWallpaperItem}
      ListHeaderComponent={<TopBar title="Wallpaper" />}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default WallpaperListScreen;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: WP(3.5),
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: WP(45),
    height: HP(30),
    marginBottom: WP(2.5),
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: WP(3),
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    position: 'absolute',
    top: WP(3),
    right: WP(3),
    width: WP(8),
    height: WP(8),
    borderRadius: WP(4),
    backgroundColor: colors.transparentBlack,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlay: {
    backgroundColor: colors.transparentBlack,
    padding: WP(3),
    marginTop: 'auto',
  },
  titleText: {
    color: colors.white,
    fontSize: fontSize(16),
    fontWeight: '600',
    marginBottom: HP(0.5),
  },
  locationText: {
    color: colors.white,
    fontSize: fontSize(12),
    opacity: 0.9,
  },
});
