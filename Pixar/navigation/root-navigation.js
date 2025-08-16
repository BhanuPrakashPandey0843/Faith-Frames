import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigation from './tab-navigation';
import { ScreenConstants } from '../app/utils/constant';
import WallpaperListScreen from '../app/wallpaper/index';

import EditProfileScreen from '../app/profile/index';
import QuizQuestionScreen from '../app/quiz/QuizQuestionScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tab" component={TabNavigation} />
        <Stack.Screen
          name={ScreenConstants.EDIT_PROFILE_SCREEN}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={ScreenConstants.WALLPAPER_LIST_SCREEN}
          component={WallpaperListScreen}
        />
        <Stack.Screen
          name={ScreenConstants.WALLPAPER_DETAIL_SCREEN}
          component={WallpaperDetailScreen}
        />
        <Stack.Screen
          name={ScreenConstants.QUIZ_QUESTION_SCREEN}
          component={QuizQuestionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
