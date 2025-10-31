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
import { saveLessonStates, loadLessonStates } from '@utils/storage';
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
  getLessonFolders,
  deleteLessonFolder,
} from '@utils/fileUtils';

const UpdateScreen = () => {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách bài học từ AsyncStorage
  const loadLessons = useCallback(async () => {
    setLoading(true);
    try {
      const allLessonsRaw = await loadLessonStates();
      if (!allLessonsRaw) return setLessons([]);

      const activeLessons = allLessonsRaw.filter(l => l.active);
      if (activeLessons.length === 0) return setLessons([]);

      const lessonIds = activeLessons.map(l => l.id);
      const latestMetaData = await fetchLessonMetadata(lessonIds);

      const folderNames = await getLessonFolders();
      for (const folderName of folderNames) {
        const isActive = lessonIds.includes(folderName);
        const folderExists = await checkLessonFolder(folderName);

        if (folderExists && !isActive) {
          console.log(`Xóa thư mục không active: ${folderName}`);
          await deleteLessonFolder(folderName);
        }
      }

      let hasChanges = false;
      const updatedLessons = await Promise.all(
        allLessonsRaw.map(async lesson => {
          const meta = latestMetaData.lessons[lesson.id];
          if (!meta) return lesson;

          if (lesson.hash && lesson.hash === meta.hash) {
            return lesson;
          }

          const updatedLesson = { ...lesson, ...meta };
          hasChanges = true;

          const dirExists = await checkLessonFolder(lesson.id);
          if (!dirExists) {
            updatedLesson.status = 'not-exist';
          } else {
            const isOutdated = !lesson.hash || lesson.hash !== meta.hash;
            updatedLesson.status = isOutdated ? 'outdated' : 'up-to-date';
          }

          return updatedLesson;
        }),
      );

      if (hasChanges) await saveLessonStates(updatedLessons);

      setLessons(updatedLessons.filter(l => l.active));
    } catch (error) {
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
      const metaRaw = await loadLessonStates();
      let metaData = [];

      if (metaRaw) {
        metaData = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
      }

      if (!Array.isArray(metaData)) {
        if (metaData && typeof metaData === 'object') {
          metaData = Object.values(metaData);
        } else {
          metaData = [];
        }
      }

      const updatedLesson = {
        ...lesson,
        status: 'up-to-date',
        updatedAt: new Date().toISOString(),
      };

      const existingIndex = metaData.findIndex(item => item.id === lesson.id);

      if (existingIndex !== -1) {
        metaData[existingIndex] = updatedLesson;
      } else {
        metaData.push(updatedLesson);
      }

      await saveLessonStates(metaData);

      // cập nhật UI list lessons hiện tại
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
