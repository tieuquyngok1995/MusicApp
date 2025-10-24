import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { MusicContext } from '../context/MusicContext';

export default function LessonContent3() {
  const { playLesson, currentLesson, isPlaying } = useContext(MusicContext);

  return (
    <View style={{ alignItems: 'center' }}>
      <Text>Lesson 3 Content</Text>
      <Button
        title="Play Lesson 3"
        onPress={() => playLesson({ id: 3, title: 'Lesson 3' })}
      />
      <Text>{isPlaying ? 'Playing: ' + currentLesson?.title : 'Paused'}</Text>
    </View>
  );
}
