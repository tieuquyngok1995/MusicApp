import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LessonCard from '../components/LessonCard';
import LessonScreen from './LessonScreen';

const bottomBarHeight = 60;

const lessons = Array.from({ length: 10 }).map((_, i) => ({
  id: `lesson${(i + 1).toString().padStart(3, '0')}`,
  title: `Bài học ${i + 1}`,
  description: `Mô tả cho bài học ${i + 1}`,
  image: 'https://via.placeholder.com/100', // ảnh đại diện bài học
}));

const HomeScreen = () => {
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const handlePress = lesson => {
    console.log('Bấm vào bài học:', lesson.title);
    setSelectedLessonId(lesson.id);
  };

  const handleSettings = () => {
    console.log('Mở màn hình Settings');
  };

  const handleUpdate = () => {
    console.log('Mở màn hình Update');
  };

  if (selectedLessonId) {
    return <LessonScreen lessonId={selectedLessonId} lessonData={'data'} />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={lessons}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <LessonCard lesson={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={{
          paddingLeft: 10,
          paddingBottom: bottomBarHeight,
        }}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#e67e22' }]}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#3498db',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
