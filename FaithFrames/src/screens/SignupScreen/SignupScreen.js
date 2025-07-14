import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      {/* Top Blue Curve */}
      <View style={styles.topCurve} />

      {/* Form Card */}
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Hello,{'\n'}Sign in!</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="#444"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#444"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.signup}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom White Curve */}
      <View style={styles.bottomCurve} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0057d9',
    position: 'relative',
    justifyContent: 'center',
  },
  topCurve: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.35,
    backgroundColor: '#00aaff',
    borderBottomRightRadius: 120,
    zIndex: 1,
  },
  innerContainer: {
    zIndex: 2,
    marginHorizontal: 25,
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 35,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 25,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00c6ff',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#00c6ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 1,
  },
  forgot: {
    color: '#f1f1f1',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  signup: {
    color: '#f1f1f1',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  bottomCurve: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.15,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 100,
    zIndex: 1,
  },
});
