import AsyncStorage from '@react-native-async-storage/async-storage';

const LESSON_KEY = 'lessonsData';

export const saveLessonStates = async lessons => {
  try {
    await AsyncStorage.setItem(LESSON_KEY, JSON.stringify(lessons));
  } catch (error) {
    console.error('Lỗi lưu bài học:', error);
  }
};

export const loadLessonStates = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(LESSON_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Lỗi đọc bài học:', error);
    return [];
  }
};
