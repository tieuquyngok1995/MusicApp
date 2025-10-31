import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '@components/buttons';
import { saveLessonStates, loadLessonStates } from '@utils/storage';
import img from '@assets/images/image.jpg';

const defaultLessons = Array.from({ length: 32 }).map((_, i) => ({
  id: `lesson${(i + 1).toString().padStart(3, '0')}`,
  title: `Bài ${i + 1}`,
  description: `Mô tả cho bài học ${i + 1}`,
  isColorRhythm: (i + 1) % 2 === 0,
  image: img,
  version: '—',
  apiUrl: '',
  hash: '',
  status: '',
  updatedAt: null,
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

          if (savedLesson) {
            return {
              ...l,
              active: savedLesson.active,
              ...savedLesson,
            };
          }

          return l;
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
    // Reset các lesson không active về giá trị mặc định
    const normalizedLessons = lessons.map(l => {
      if (!l.active) {
        return {
          ...l,
          version: '—',
          apiUrl: '',
          hash: '',
          status: '',
          updatedAt: null,
        };
      }
      return l;
    });

    await saveLessonStates(normalizedLessons);
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
      <AppButton
        title="Save Settings"
        onPress={handleSave}
        mode="primary"
        style={{ width: 200, left: '50%', transform: [{ translateX: -100 }] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  backButton: {
    marginBottom: 8,
    backgroundColor: '#0077b6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: 120,
  },
  backText: {
    color: '#caf0f8',
    fontSize: 16,
    fontWeight: '600',
  },
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
