// E:\2025\Freelance\Faith-Frames\Pixar\components\StackCard.js
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import StackCardItem from './StackCardItem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { data } from '../app/data/images';
import { HP } from '../app/theme/scale';

const StackCard = () => {
  const [actualIndex, setActualIndex] = useState(data.length - 1);
  return (
    <GestureHandlerRootView style={styles.gestureHandlerView}>
      <View style={styles.container}>
        {data.map((item, index) => (
          <StackCardItem
            key={item.id}
            actualIndex={actualIndex}
            item={item}
            index={index}
            setActualIndex={setActualIndex}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

export default StackCard;

const styles = StyleSheet.create({
  gestureHandlerView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: HP(8),
  },
});
