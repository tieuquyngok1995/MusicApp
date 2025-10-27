import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveLessonStates, loadLessonStates } from '../utils/Storage';
import img from '@assets/images/image.jpg';

const defaultLessons = Array.from({ length: 32 }).map((_, i) => ({
  id: `lesson${(i + 1).toString().padStart(3, '0')}`,
  title: `Bài ${i + 1}`,
  description: `Mô tả cho bài học ${i + 1}`,
  isColorRhythm: i / 2 !== 0,
  image: img,
  active: false,
}));

export default function SettingScreen() {
  const [lessons, setLessons] = useState(defaultLessons);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      const saved = await loadLessonStates();
      if (saved.length > 0) {
        const merged = defaultLessons.map(l => {
          const savedLesson = saved.find(s => s.id === l.id);
          return savedLesson ? { ...l, active: savedLesson.active } : l;
        });
        setLessons(merged);
      }
    };
    load();
  }, []);

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const toggleActive = id => {
    setLessons(prev =>
      prev.map(l => (l.id === id ? { ...l, active: !l.active } : l)),
    );
  };

  const handleSave = async () => {
    await saveLessonStates(lessons);
    alert('Đã lưu danh sách bài học!');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.lessonButton,
        { backgroundColor: item.active ? '#4CAF50' : '#ccc' },
      ]}
      onPress={() => toggleActive(item.id)}
    >
      <Text style={styles.lessonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity onPress={goHome} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chọn bài học để kích hoạt</Text>

      {/* Danh sách dạng lưới 4 cột */}
      <FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={4}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Lưu lựa chọn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  backButton: { marginBottom: 8 },
  backText: { color: 'blue', fontSize: 16 },
  title: { fontSize: 18, marginVertical: 8 },
  listContainer: {
    paddingBottom: 80, // chừa chỗ cho nút lưu
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lessonButton: {
    flex: 1,
    margin: 4,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  lessonText: { color: '#fff', fontWeight: '600' },
  saveButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
