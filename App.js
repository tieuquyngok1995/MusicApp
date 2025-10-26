import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { MusicProvider } from './src/context/MusicContext';
import SplashScreen from 'react-native-splash-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Màn hình chính
import { HomeScreen, LessonScreen } from '@screens';

// Các màn hình section (LessonCommon sẽ gọi tới)

import { Greeting, Singing, Goodbye } from '@components/sections';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <MusicProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          {/* Màn hình chính */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lesson" component={LessonScreen} />

          {/* Các màn hình section */}
          <Stack.Screen name="GreetingSection" component={Greeting} />
          <Stack.Screen name="SingingSection" component={Singing} />
          <Stack.Screen name="GoodbyeSection" component={Goodbye} />
        </Stack.Navigator>
      </NavigationContainer>
    </MusicProvider>
  );
}
