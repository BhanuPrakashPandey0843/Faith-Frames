// components/imageGrid.js

import React from "react";
import { View, StyleSheet } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./imageCard";
import { getColumnCount, wp } from "../helpers/common";

const ImageGrid = ({ images = [], router }) => {
  const columns = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        estimatedItemSize={300}
        initialNumToRender={20}
        maxToRenderPerBatch={columns * 10}
        updateCellsBatchingPeriod={50}
        windowSize={15}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            index={index}
            columns={columns}
            router={router}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp(100),
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
  },
});

export default ImageGrid;
