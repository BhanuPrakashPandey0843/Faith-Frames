import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Easing,
} from 'react-native';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
  const [isReady, setIsReady] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const logo = require('./logoapp.png');

  useEffect(() => {
    const prepare = async () => {
      await Asset.fromModule(logo).downloadAsync();
      setIsReady(true);

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    };

    prepare();
  }, []);

  if (!isReady) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '0deg'],
  });

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1c1c1c', '#0a0a0a']}
      style={styles.container}
    >
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotate },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.55,
    height: Dimensions.get('window').width * 0.55,
    shadowColor: '#ffffff',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default SplashScreen;
