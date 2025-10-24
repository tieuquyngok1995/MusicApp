import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { MusicContext } from '../context/MusicContext';

export default function LessonScreen() {
  const { playLesson, currentLesson, isPlaying } = useContext(MusicContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Lesson Screen</Text>
      <Button
        title="Play Lesson"
        onPress={() => playLesson({ id: 1, title: 'Lesson 1' })}
      />
      <Text>{isPlaying ? 'Playing: ' + currentLesson?.title : 'Paused'}</Text>
    </View>
  );
}
