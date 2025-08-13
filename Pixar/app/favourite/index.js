import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { fontSize } from '../theme/scale';

const FavouriteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fontSize(40),
    fontWeight: 'bold',
  },
});

export default FavouriteScreen;
