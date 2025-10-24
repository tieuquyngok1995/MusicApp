import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { MusicProvider } from './src/context/MusicContext';

export default function App() {
  return (
    <MusicProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </MusicProvider>
  );
}
