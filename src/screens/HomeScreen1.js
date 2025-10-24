import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import CircleButton from '../components/common/CircleButton';
import Colors from '../constants/Colors';
import Audios from '../constants/Audios';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>

        <View style={{ flex: 1 }}>
          <CircleButton
            color={Colors.C}
            audioFile={Audios.C}
            style={{ position: 'absolute', top: 370, left: -420 }}
          />
          <CircleButton
            color={Colors.D}
            audioFile={Audios.D}
            style={{ position: 'absolute', top: 325, left: -295 }}
          />
          <CircleButton
            color={Colors.E}
            audioFile={Audios.E}
            style={{ position: 'absolute', top: 280, left: -170 }}
          />
          <CircleButton
            color={Colors.F}
            audioFile={Audios.F}
            style={{ position: 'absolute', top: 230, left: -50 }}
          />
          <CircleButton
            color={Colors.G}
            audioFile={Audios.G}
            style={{ position: 'absolute', top: 185, left: 65 }}
          />
          <CircleButton
            color={Colors.A}
            audioFile={Audios.A}
            style={{ position: 'absolute', top: 140, left: 190 }}
          />
          <CircleButton
            color={Colors.B}
            audioFile={Audios.B}
            style={{ position: 'absolute', top: 90, left: 315 }}
          />
          <CircleButton
            color={Colors.C}
            audioFile={Audios.C2}
            style={{ position: 'absolute', top: 45, left: 440 }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
