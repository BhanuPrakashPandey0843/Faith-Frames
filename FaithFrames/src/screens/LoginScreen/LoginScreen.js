import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(1000)} style={styles.card}>
        <Text style={styles.welcome}>Welcome Back</Text>

        <Image
          source={require('../LoginScreen/logoapp.png')} 
          style={styles.logo}
        />

        <Text style={styles.company}>You Company</Text>
        <Text style={styles.tagline}>Your Tag Line Here</Text>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
         
            navigation.navigate('Create');
          }}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => {
            navigation.navigate('Signup');
          }}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.social}>Sign In with Social Media</Text>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0056d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 30,
    borderRadius: 30,
    backgroundColor: '#0056d6',
    alignItems: 'center',
  },
  welcome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  company: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tagline: {
    color: '#d0dfff',
    fontSize: 14,
    marginBottom: 40,
  },
  loginBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 15,
  },
  loginText: {
    color: '#0056d6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupBtn: {
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 30,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  social: {
    color: '#d0dfff',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
