import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearAllLazyModules } from '@utils/LazyLoader';
import { LessonCommon } from '@components/layouts';

export default function LessonScreen({ lessonId, lessonData }) {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Khi rời khỏi LessonScreen (ví dụ quay về Home)
      clearAllLazyModules();
    });

    return unsubscribe;
  }, [navigation]);

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (!lessonId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bài học không tồn tại hoặc chưa được tạo</Text>
        <Button title="Quay lại" onPress={goHome} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Button title="Quay lại" onPress={goHome} />
      <LessonCommon lessonId={lessonId} lessonData={lessonData} />
    </View>
  );
}
