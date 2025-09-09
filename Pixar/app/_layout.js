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
          {/* ================= ROOT ================= */}
          <Stack.Screen name="index" />

          {/* ================= AUTH ================= */}
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/forgot-password" />

          {/* ================= HOME ================= */}
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
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* ================= FAVOURITES ================= */}
          <Stack.Screen name="favourite/FavouriteScreen" />

          {/* ================= MOTIVATION ================= */}
          <Stack.Screen name="motivation/MotivationScreen" />
          <Stack.Screen name="motivation/daily-verse" />
          <Stack.Screen name="motivation/daily-prayers" />
          <Stack.Screen name="motivation/gods-words" />
          <Stack.Screen name="motivation/witness" />
          {/* ✅ Added detail screen for study plans */}
          <Stack.Screen name="motivation/PlanDetail" />

          {/* ================= PROFILE ================= */}
          <Stack.Screen name="profile/index" />
          <Stack.Screen name="profile/EditProfileScreen" />

          {/* ================= SETTINGS ================= */}
          <Stack.Screen name="setting/SettingScreen" />

          {/* ================= INFO PAGES ================= */}
          <Stack.Screen name="contact-us/index" />
          <Stack.Screen name="rate-app/index" />

          {/* ================= QUIZ ================= */}
          <Stack.Screen name="quiz/QuizScreen" />
          <Stack.Screen name="quiz/QuizQuestionScreen" />
          <Stack.Screen name="quiz/ProgressOpacity" />
          <Stack.Screen name="quiz/ThanksScreen" />

          {/* ================= WALLPAPER ================= */}
          <Stack.Screen name="wallpaper/index" />
          <Stack.Screen name="wallpaper/WallpaperListScreen" />
          <Stack.Screen
            name="wallpaper/WallpaperDetailScreen"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* ================= LEGAL ================= */}
          <Stack.Screen name="legal/terms-and-conditions" />
          <Stack.Screen name="legal/privacy-policy" />

          {/* ================= PLAYGROUND ================= */}
          <Stack.Screen name="reactnav/index" />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
