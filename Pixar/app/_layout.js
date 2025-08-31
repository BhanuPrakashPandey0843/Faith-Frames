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
          <Stack.Screen name="home/index" />
          <Stack.Screen
            name="home/image"
            options={{
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="home/payment/index"
            options={{ presentation: "modal" }}
          />

          {/* Favourite */}
          <Stack.Screen name="favourite/FavouriteScreen" />

          {/* Motivation */}
          <Stack.Screen name="motivation/MotivationScreen" />
          <Stack.Screen name="motivation/daily-verse" />
          <Stack.Screen name="motivation/daily-prayers" />
          <Stack.Screen name="motivation/gods-words" />
          <Stack.Screen name="motivation/witness" />

          {/* Profile */}
          <Stack.Screen name="profile/EditProfileScreen" />

          {/* Settings */}
          <Stack.Screen name="setting/SettingScreen" />

          {/* Contact Us */}
          <Stack.Screen name="contact-us/index" />

          {/* Rate Our App */}
          <Stack.Screen name="rate-app/index" />

          {/* Quiz */}
          <Stack.Screen name="quiz/QuizScreen" />
          <Stack.Screen name="quiz/QuizQuestionScreen" />
          <Stack.Screen name="quiz/ProgressOpacity" />
          <Stack.Screen name="quiz/ThanksScreen" />   {/* ✅ Thanks screen */}

          {/* Wallpaper */}
          <Stack.Screen name="wallpaper/index" />
          <Stack.Screen name="wallpaper/WallpaperListScreen" />
          <Stack.Screen
            name="wallpaper/WallpaperDetailScreen"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* Legal Pages */}
          <Stack.Screen name="legal/terms-and-conditions" />
          <Stack.Screen name="legal/privacy-policy" />

          {/* ReactNav playground */}
          <Stack.Screen name="reactnav/index" />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
