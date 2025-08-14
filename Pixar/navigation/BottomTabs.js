// navigation/BottomTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { ScreenConstants } from '../app/utils/constant';
import HomeScreen from '../app/home/index';
import QuizScreen from '../app/quiz';
import FavouriteScreen from '../app/favourite';
import SettingScreen from '../app/setting';
import Icon from '../components/Icon';
import { colors } from '../app/theme/colors';
import { fontSize, HP, WP } from '../app/theme/scale';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={ScreenConstants.HOME_SCREEN}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => menuIcons(route, focused),
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          marginBottom: HP(4),
          marginHorizontal: WP(15),
          borderRadius: HP(4),
          backgroundColor: colors.dark,
          height: HP(8),
        },
        tabBarItemStyle: {
          marginTop: Platform.OS === 'ios' ? HP(1.5) : HP(1.8),
        },
      })}
    >
      <Tab.Screen name={ScreenConstants.HOME_SCREEN} component={HomeScreen} />
      <Tab.Screen name={ScreenConstants.FAVOURITE_SCREEN} component={FavouriteScreen} />
      <Tab.Screen
        name={ScreenConstants.QUIZ_SCREEN}
        component={QuizScreen}
        options={{ tabBarStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name={ScreenConstants.SETTING_SCREEN}
        component={SettingScreen}
        options={{ tabBarStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  );
};

const menuIcons = (route, focused) => {
  const iconProps = {
    size: fontSize(24),
    color: focused ? colors.dark : colors.light,
    variant: 'outline',
    strokeWidth: 2,
  };

  let iconName = '';
  switch (route.name) {
    case ScreenConstants.HOME_SCREEN:
      iconName = 'HomeIcon';
      break;
    case ScreenConstants.QUIZ_SCREEN:
      iconName = 'BookOpenIcon';
      break;
    case ScreenConstants.FAVOURITE_SCREEN:
      iconName = 'HeartIcon';
      break;
    case ScreenConstants.SETTING_SCREEN:
      iconName = 'Cog8ToothIcon';
      break;
  }

  return (
    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      {iconName && <Icon name={iconName} {...iconProps} />}
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  iconContainer: {
    width: WP(12),
    height: WP(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedIconContainer: {
    backgroundColor: colors.background,
    borderRadius: WP(6),
  },
});
