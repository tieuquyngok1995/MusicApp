import React from 'react';
import { View, Text } from 'react-native';
import LessonContent1 from '../components/LessonContent1';
import LessonContent2 from '../components/LessonContent2';
import LessonContent3 from '../components/LessonContent3';

// import các component khác khi cần

export default function LessonScreen({ route }) {
  const { lessonId } = route.params;

  const renderLesson = () => {
    switch (lessonId) {
      case 1:
        return <LessonContent1 />;
      case 2:
        return <LessonContent2 />;
      case 3:
        return <LessonContent3 />;
      default:
        return (
          <View>
            <Text>Lesson coming soon...</Text>
          </View>
        );
    }
  };

  return <View>{renderLesson()}</View>;
}
