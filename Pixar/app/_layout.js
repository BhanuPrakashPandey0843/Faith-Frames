// app/_layout.js
import React from "react";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "default",
          }}
        >
          {/* Root */}
          <Stack.Screen name="index" />

          {/* Auth */}
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/forgot-password" />

          {/* Home */}
          {/* `home/index.js` renders at /home */}
          <Stack.Screen name="home/index" />
          {/* Image preview as a transparent modal */}
          <Stack.Screen
            name="home/image"
            options={{
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
          {/* Payment (nested under home/payment/index.js) */}
          <Stack.Screen
            name="home/payment/index"
            options={{ presentation: "modal" }}
          />

          {/* Favourite */}
          {/* File is index.jsx, so route is /favourite/FavouriteScreen */}
          <Stack.Screen name="favourite/FavouriteScreen" />

          {/* Profile */}
          <Stack.Screen name="profile/EditProfileScreen" />

          {/* Settings */}
          <Stack.Screen name="setting/SettingScreen" />

          {/* Quiz */}
          <Stack.Screen name="quiz/QuizScreen" />
          <Stack.Screen name="quiz/QuizQuestionScreen" />
          {/* If this is a helper view you push, keep it hidden header too */}
          <Stack.Screen name="quiz/ProgressOpacity" />

          {/* Wallpaper */}
          {/* If you navigate to /wallpaper (index.js) */}
          <Stack.Screen name="wallpaper/index" />
          <Stack.Screen name="wallpaper/WallpaperListScreen" />
          <Stack.Screen
            name="wallpaper/WallpaperDetailScreen"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* ReactNav playground (if you still use it) */}
          <Stack.Screen name="reactnav/index" />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
