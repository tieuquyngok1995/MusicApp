import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import PracticeScreen from '../screens/PracticeScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="Lesson 1"
        component={LessonScreen}
        initialParams={{ lessonId: 1 }}
      />
      <Drawer.Screen
        name="Lesson 2"
        component={LessonScreen}
        initialParams={{ lessonId: 2 }}
      />
      <Drawer.Screen
        name="Lesson 3"
        component={LessonScreen}
        initialParams={{ lessonId: 3 }}
      />
      <Drawer.Screen name="Practice" component={PracticeScreen} />
    </Drawer.Navigator>
  );
}
