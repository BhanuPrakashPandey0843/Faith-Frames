// app/favourite/index.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from '../../components/Icon';
import TopBar from '../../components/TopBar';
import { colors } from '../theme/colors';
import { fontSize, HP, WP } from '../theme/scale';
import { data } from '../data/images'; // your wallpapers data

const FavouriteScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = id => {
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
              pathname: '/wallpaper/[id]',
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
                variant={isFavorite ? 'solid' : 'outline'}
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
    <View style={styles.container}>
      <TopBar title="Favourite Wallpapers" />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingHorizontal: WP(3),
    paddingBottom: HP(3),
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: WP(45),
    height: HP(30),
    marginBottom: WP(3),
    borderRadius: WP(3),
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
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
    borderBottomLeftRadius: WP(3),
    borderBottomRightRadius: WP(3),
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
  emptyContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: fontSize(16),
    color: colors.placeholder,
    fontWeight: '500',
  },
});
