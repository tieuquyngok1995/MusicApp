import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function LessonCard({ title, image, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Image source={image} />
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
