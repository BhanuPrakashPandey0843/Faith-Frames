import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Icon from "./Icon";
import { data } from "../app/data/images";
import { fontSize, HP, WP } from "../app/theme/scale";
import { colors } from "../app/theme/colors";
import { useRouter } from "expo-router";
import { ScreenConstants } from "../app/utils/constant";

const StackCardItem = ({ item, index, actualIndex, setActualIndex }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const position = useSharedValue({ x: 0, y: 0 });
  const lastOffset = useSharedValue({ x: 0, y: 0 });
  const value = useSharedValue(data.length);

  const panGestureHandler = Gesture.Pan()
    .runOnJS(true)
    .onUpdate(({ translationX, translationY }) => {
      position.value = {
        x: translationX + lastOffset.value.x,
        y: translationY + lastOffset.value.y,
      };
    })
    .onEnd(() => {
      if (
        Math.abs(position.value.x) < 100 &&
        Math.abs(position.value.y) < 100
      ) {
        lastOffset.value = { x: 0, y: 0 };
        position.value = withSpring({ x: 0, y: 0 });
      } else {
        lastOffset.value = { x: 0, y: 0 };
        position.value = withTiming({
          x: position.value.x * 10,
          y: position.value.y * 10,
        });
        setActualIndex(actualIndex - 1);
        data.pop();
      }
    });

  const rotate = useDerivedValue(() => {
    return interpolate(
      index,
      [value.value - 3, value.value - 2, value.value - 1, value.value],
      [0, 8, -8, 0],
      Extrapolate.CLAMP
    );
  });

  const additionalTranslate = useDerivedValue(() => {
    return interpolate(
      index,
      [value.value - 3, value.value - 2, value.value - 1, value.value],
      [0, 30, -30, 0],
      Extrapolate.CLAMP
    );
  });

  const scale = useDerivedValue(() => {
    return interpolate(
      index,
      [value.value - 3, value.value - 2, value.value - 1, value.value],
      [0.2, 0.9, 0.9, 1],
      Extrapolate.CLAMP
    );
  });

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: `${rotate.value}deg` },
        { translateX: position.value.x + additionalTranslate.value },
        { translateY: position.value.y },
        { scale: scale.value },
      ],
    };
  });

  useEffect(() => {
    value.value = withSpring(actualIndex, {
      stiffness: 100,
    });
  }, [actualIndex]);

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[{ zIndex: actualIndex + 1 }, styles.container, rnStyle]}
      >
        <ImageBackground source={{ uri: item.uri }} style={styles.imagesStyle}>
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Icon
              name="HeartIcon"
              size={24}
              color={isFavorite ? colors.favourite : colors.white}
              variant={isFavorite ? "solid" : "outline"}
            />
          </TouchableOpacity>

          <View style={styles.imageView}>
            {/* Country Label */}
            <View style={styles.countryContainer}>
              <Text style={styles.countryText}>{item.country}</Text>
            </View>

            {/* Location and Rating */}
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>{item.location}</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingInnerContainer}>
                  <Icon
                    name="StarIcon"
                    size={fontSize(16)}
                    color={colors.white}
                    variant="outline"
                  />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text style={styles.reviewsText}>
                  {item.reviews} reviews
                </Text>
              </View>
            </View>

            {/* See More Button */}
            <TouchableOpacity
  onPress={() => router.push(ScreenConstants.WALLPAPER_LIST_SCREEN)}
  style={styles.seeMoreButton}
>
  <Text style={[styles.seeMoreText, { flex: 1, textAlign: "center" }]}>
    See more
  </Text>
  <View style={styles.seeMoreIconContainer}>
    <Icon
      name="ChevronRightIcon"
      size={fontSize(20)}
      color={colors.dark}
    />
  </View>
</TouchableOpacity>

          </View>
        </ImageBackground>
      </Animated.View>
    </GestureDetector>
  );
};

export default StackCardItem;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: WP(70),
    height: HP(45),
  },
  imageView: {
    flex: 1,
    justifyContent: "flex-end",
    padding: WP(4),
  },
  imagesStyle: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: WP(4),
    objectFit: "contain",
  },
  favoriteButton: {
    position: "absolute",
    top: WP(4),
    right: WP(4),
    width: WP(10),
    height: WP(10),
    borderRadius: WP(5),
    borderWidth: 1,
    borderColor: colors.white + "50",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  countryContainer: {
    alignSelf: "flex-start",
    marginBottom: HP(1),
  },
  countryText: {
    color: colors.white,
    fontSize: fontSize(14),
    fontWeight: "500",
    opacity: 0.9,
  },
  locationContainer: {
    marginBottom: HP(1.5),
  },
  locationText: {
    color: colors.white,
    fontSize: fontSize(24),
    fontWeight: "700",
    marginBottom: HP(1),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: WP(2),
    opacity: 0.8,
  },
  ratingInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: WP(1),
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: WP(2),
    paddingVertical: WP(0.5),
  },
  ratingText: {
    color: colors.white,
    fontSize: fontSize(16),
    fontWeight: "600",
  },
  reviewsText: {
    color: colors.white,
    fontSize: fontSize(14),
  },
  seeMoreButton: {
    backgroundColor: colors.transparent,
    borderRadius: 999,
    paddingVertical: WP(3),
    paddingHorizontal: WP(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  seeMoreIconContainer: {
    position: "absolute",
    right: 4,
    backgroundColor: colors.white,
    borderRadius: 999,
    width: WP(10),
    height: WP(10),
    alignItems: "center",
    justifyContent: "center",
  },
  seeMoreText: {
    color: colors.white,
    fontSize: fontSize(16),
    fontWeight: "600",
  },
});
