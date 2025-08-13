// Pixar\app\reactnav\index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from '../../navigation/root-navigation'; // adjust path as needed

export default function ReactNav() {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}

