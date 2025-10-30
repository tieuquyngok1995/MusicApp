import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  fetchLessonMetadata,
  getLessonDownloadUrl,
} from '@services/lessonService';
import {
  ensureLessonFolder,
  downloadLessonZip,
  unzipLesson,
  checkLessonFolder,
} from '@utils/fileUtils';
import RNFS from 'react-native-fs';

// Đường dẫn thư mục gốc lưu dữ liệu
const LESSONS_DIR = `${RNFS.DocumentDirectoryPath}/lessons`;
const API_BASE = 'http://172.16.4.38:9891/api/lessons';

const UpdateScreen = () => {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách bài học từ AsyncStorage
  const loadLessons = useCallback(async () => {
    setLoading(true);
    try {
      const allLessonsRawStr = await AsyncStorage.getItem('lessonsData');
      if (!allLessonsRawStr) return setLessons([]);

      const allLessonsRaw = JSON.parse(allLessonsRawStr);
      const activeLessons = allLessonsRaw.filter(l => l.active);
      if (activeLessons.length === 0) return setLessons([]);

      const lessonIds = activeLessons.map(l => l.id);
      const latestMetaData = await fetchLessonMetadata(lessonIds);

      let hasChanges = false;
      const updatedLessons = await Promise.all(
        allLessonsRaw.map(async lesson => {
          const meta = latestMetaData.lessons[lesson.id];
          if (!meta) return lesson;

          const updatedLesson = { ...lesson };
          ['version', 'hash', 'apiUrl'].forEach(k => {
            if (!lesson[k] || lesson[k] !== meta[k]) {
              updatedLesson[k] = meta[k];
              hasChanges = true;
            }
          });

          const dirExists = await checkLessonFolder(lesson.id);
          if (!dirExists) {
            updatedLesson.status = 'not-exist';
          } else {
            const isOutdated =
              !lesson.version ||
              lesson.version !== meta.version ||
              !lesson.hash ||
              lesson.hash !== meta.hash;
            updatedLesson.status = isOutdated ? 'outdated' : 'up-to-date';
          }

          return updatedLesson;
        }),
      );

      if (hasChanges)
        await AsyncStorage.setItem(
          'lessonsData',
          JSON.stringify(updatedLessons),
        );

      setLessons(updatedLessons.filter(l => l.active));
    } catch (error) {
      console.error('Lỗi loadLessons:', error);
      Alert.alert('Lỗi', `Không thể tải danh sách bài học  ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleDownloadLesson = async lesson => {
    try {
      setLoading(true);

      const lessonDir = await ensureLessonFolder(lesson.id);
      const url = getLessonDownloadUrl(lesson.id);
      const zipPath = await downloadLessonZip(url, lesson.id);
      await unzipLesson(zipPath, lessonDir);

      // cập nhật AsyncStorage
      const metaRaw = await AsyncStorage.getItem('lessonMeta');
      const metaData = metaRaw ? JSON.parse(metaRaw) : {};
      metaData[lesson.id] = {
        ...lesson,
        status: 'up-to-date',
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('lessonMeta', JSON.stringify(metaData));

      setLessons(prev =>
        prev.map(l =>
          l.id === lesson.id ? { ...l, status: 'up-to-date' } : l,
        ),
      );

      Alert.alert('Thành công', `Đã tải và giải nén ${lesson.title}`);
    } catch (error) {
      console.error('Lỗi tải bài học:', error);
      Alert.alert('Lỗi', `Không thể tải bài học ${lesson.title}`);
    } finally {
      setLoading(false);
    }
  };

  // phần render giữ nguyên
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Đang kiểm tra...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>⬅ Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Kiểm tra dữ liệu bài học</Text>
      {lessons.length === 0 ? (
        <Text style={styles.emptyText}>
          Không có bài học nào được kích hoạt.
        </Text>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={styles.lessonCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.detail}>
                  Phiên bản: {item.version ?? '—'}
                </Text>
                <Text style={styles.status}>
                  {item.status === 'up-to-date'
                    ? '✅ Đã có dữ liệu mới nhất'
                    : item.status === 'outdated'
                    ? '⚠️ Cần cập nhật'
                    : '⚠️ Chưa có dữ liệu'}
                </Text>
              </View>

              {item.status !== 'up-to-date' && (
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleDownloadLesson(item)}
                >
                  <Text style={styles.updateText}>
                    {item.status === 'outdated' ? 'Cập nhật' : 'Tải'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  detail: {
    fontSize: 13,
    color: '#666',
  },
  status: {
    fontSize: 14,
    color: '#333',
    marginTop: 3,
  },
  updateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  updateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
