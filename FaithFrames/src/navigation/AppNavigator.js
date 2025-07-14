import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import WallpaperModeScreen from '../screens/WallpaperModeScreen';
import WallpaperSelectionScreen from '../screens/WallpaperSelectionScreen';
import QuoteLanguageScreen from '../screens/QuoteLanguageScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import WallpaperPreviewScreen from '../screens/WallpaperPreviewScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPVerificationScreen} />
        <Stack.Screen name="WallpaperMode" component={WallpaperModeScreen} />
        <Stack.Screen name="WallpaperSelection" component={WallpaperSelectionScreen} />
        <Stack.Screen name="QuoteLanguage" component={QuoteLanguageScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="WallpaperPreview" component={WallpaperPreviewScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
