// components/imageCard.js
import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, wp } from "../helpers/common";
import { theme } from "../constants/theme";

const ImageCard = ({ item, columns, index, router }) => {
  const isLastInRow = () => (index + 1) % columns !== 0;

  const getImageHeight = () => {
    let { imageHeight = 300, imageWidth = 200 } = item || {};
    const finalHeight = getImageSize(imageHeight, imageWidth);
    return { height: finalHeight > 50 ? finalHeight : 300 };
  };

  const handlePress = () => {
    if (item) {
      router.push({ pathname: "home/image", params: { ...item } });
    }
  };

  const imageUri =
    item?.url?.startsWith("http")
      ? item.url
      : item?.webformatURL?.startsWith("http")
      ? item.webformatURL
      : "https://via.placeholder.com/300";

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.imageWrapper, isLastInRow() && styles.spacing]}
    >
      <Image
        style={[styles.image, getImageHeight()]}
        source={{ uri: imageUri }}
        contentFit="cover"
        transition={100}
        onError={(e) =>
          console.log("Image load error:", e?.nativeEvent?.error || e)
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    borderRadius: theme.radius.xl,
    backgroundColor: "#eee",
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG || "#f5f5f5",
    borderRadius: theme.radius.xl,
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
});

export default ImageCard;



