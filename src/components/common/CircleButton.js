import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';
import { Pressable } from 'react-native';

const CircleButton = ({ color = '#3498db', audioFile, style }) => {
  const playAudio = () => {
    if (!audioFile) return;

    const sound = new Sound(audioFile, Sound.MAIN_BUNDLE, error => {
      if (error) {
        return;
      }
      sound.play(success => {
        if (!success) {
        }
        sound.release();
      });
    });
  };

  return (
    <Pressable
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={playAudio}
      android_disableSound={true}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default CircleButton;
