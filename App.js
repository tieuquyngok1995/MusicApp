import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { MusicProvider } from './src/context/MusicContext';
import SplashScreen from 'react-native-splash-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './src/screens/HomeScreen';
import LessonScreen from './src/screens/LessonScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
