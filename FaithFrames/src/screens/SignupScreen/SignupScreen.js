import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  // ✅ Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* ✅ Top Section with Logo */}
      <Animated.View style={[styles.topSection, { opacity: fadeAnim }]}>
        <Image
          source={require('../LoginScreen/logoapp.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Faith Frames</Text>

        {/* ✅ Wave Shape */}
        <Svg
          height={70}
          width={width}
          viewBox="0 0 1440 320"
          style={styles.waveSvg}
        >
          <Path
            fill="#FF6A00"
            d="M0,96L80,128C160,160,320,224,480,240C640,256,800,224,960,208C1120,192,1280,192,1360,192L1440,192V320H0Z"
          />
        </Svg>
      </Animated.View>

      {/* ✅ Bottom Section with Gradient */}
      <LinearGradient
        colors={['#FF8C2B', '#FF6A00']}
        style={styles.bottomGradient}
      >
        <Animated.View
          style={[
            styles.bottomSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Sign in to your account</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#ff6a00" />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
            />
            <Ionicons name="checkmark-outline" size={20} color="#ff6a00" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#ff6a00" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            <Ionicons name="checkmark-outline" size={20} color="#ff6a00" />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button with Press Animation */}
          <TouchableOpacity
            style={styles.signInButton}
            activeOpacity={0.9}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text style={styles.signupText}>
            Don’t have an account?{' '}
            <Text style={styles.signupLink}>Sign Up</Text>
          </Text>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <Animated.View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6A00',
  },

  /* ✅ Top Section */
  topSection: {
    backgroundColor: '#fff',
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6A00',
  },
  waveSvg: {
    position: 'absolute',
    bottom: -1,
  },

  /* ✅ Gradient Bottom Section */
  bottomGradient: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '600',
  },

  /* ✅ Input Fields */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30, // pill-like rounded shape
    paddingHorizontal: 18,
    height: 50,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 0,
  },

  /* ✅ Links & Buttons */
  forgot: {
    color: '#fff',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  signInButton: {
    backgroundColor: '#3B2000',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  signupLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  /* ✅ Pagination Dots */
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    opacity: 0.4,
    marginHorizontal: 6,
  },
  activeDot: {
    width: 10,
    height: 10,
    opacity: 1,
  },
});
