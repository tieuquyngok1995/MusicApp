import { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { clearAllLazyModules } from '@utils/lazyLoader';
import LessonCommon from '@screens/LessonCommon';
import PropTypes from 'prop-types';

export default function LessonScreen({ route, navigation }) {
  const { lessonId, isColorRhythm } = route.params ?? {};

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
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
      <LessonCommon lessonId={lessonId} isColorRhythm={isColorRhythm} />
    </View>
  );
}

LessonScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      lessonId: PropTypes.string,
      isColorRhythm: PropTypes.bool,
    }),
  }),
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }),
};
