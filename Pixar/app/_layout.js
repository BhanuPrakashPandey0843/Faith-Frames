import { View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="home/image"
            options={{
              headerShown: false,
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
           <Stack.Screen name="home/payment" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
