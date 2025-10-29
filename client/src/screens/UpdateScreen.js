import React, { useEffect, useState, useCallback } from 'react';
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
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { unzip } from 'react-native-zip-archive';

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
      // 1️⃣ Load dữ liệu local
      const allLessonsRawStr = await AsyncStorage.getItem('lessonsData');
      if (!allLessonsRawStr) {
        setLessons([]);
        return;
      }

      const allLessonsRaw = JSON.parse(allLessonsRawStr);

      // Lọc các bài active
      const activeLessons = allLessonsRaw.filter(l => l.active);
      if (activeLessons.length === 0) {
        setLessons([]);
        return;
      }

      // 2️⃣ Gọi API metadata để lấy dữ liệu mới nhất
      const lessonIds = activeLessons.map(l => l.id);
      const response = await fetch(`${API_BASE}/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons: lessonIds }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const latestMetaData = await response.json();
      console.log('123');
      console.log(JSON.stringify(latestMetaData, null, 2));

      // 3️⃣ Merge metadata và xác định status
      let hasChanges = false;
      const updatedLessons = await Promise.all(
        allLessonsRaw.map(async lesson => {
          const meta = latestMetaData.lessons[lesson.id];
          if (!meta) return lesson; // nếu server không trả metadata → giữ nguyên

          // Cập nhật version, hash, apiUrl nếu khác hoặc trống
          const updatedLesson = { ...lesson };
          ['version', 'hash', 'apiUrl'].forEach(key => {
            if (!lesson[key] || lesson[key] !== meta[key]) {
              updatedLesson[key] = meta[key];
              hasChanges = true;
            }
          });

          // Kiểm tra thư mục local để xác định trạng thái
          const lessonDir = `${LESSONS_DIR}/${lesson.id}`;
          const dirExists = await RNFS.exists(lessonDir);

          if (!dirExists) {
            updatedLesson.status = 'not-exist';
          } else {
            // Kiểm tra xem localMeta có outdated không
            const localMeta = allLessonsRaw.find(l => l.id === lesson.id);
            const isOutdated =
              !localMeta ||
              localMeta.version !== meta.version ||
              localMeta.hash !== meta.hash;
            updatedLesson.version = meta.version;
            updatedLesson.status = isOutdated ? 'outdated' : 'up-to-date';
          }

          return updatedLesson;
        }),
      );

      // 4️⃣ Lưu lại nếu có thay đổi
      if (hasChanges) {
        await AsyncStorage.setItem(
          'lessonsData',
          JSON.stringify(updatedLessons),
        );
        console.log('✅ Đã cập nhật lessonsData');
      }

      // 5️⃣ Cập nhật state để render layout
      setLessons(updatedLessons.filter(l => l.active));
    } catch (error) {
      console.error('Lỗi loadLessons:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  // Hàm tải/cập nhật bài học (mô phỏng)
  const handleDownloadLesson = async lesson => {
    try {
      setLoading(true);

      const lessonDir = `${LESSONS_DIR}/${lesson.id}`;
      await RNFS.mkdir(lessonDir);

      const zipPath = `${RNFS.CachesDirectoryPath}/${lesson.id}.zip`;
      const url = `${API_BASE}/${lesson.id}/download`;

      console.log('Bắt đầu tải:', url);

      // Tải file zip từ server
      const download = await RNFS.downloadFile({
        fromUrl: url,
        toFile: zipPath,
        background: true,
        discretionary: true,
      }).promise;

      if (download.statusCode !== 200) {
        throw new Error(`Tải thất bại: HTTP ${download.statusCode}`);
      }

      console.log('Tải xong ZIP:', zipPath);

      // Giải nén file zip vào thư mục bài học
      const unzipResult = await unzip(zipPath, lessonDir);
      console.log('Giải nén đến:', unzipResult);

      // Xóa file zip sau khi giải nén
      await RNFS.unlink(zipPath);

      // 1️⃣ Cập nhật metadata cục bộ nếu cần (AsyncStorage)
      const metaRaw = await AsyncStorage.getItem('lessonMeta');
      const metaData = metaRaw ? JSON.parse(metaRaw) : {};
      metaData[lesson.id] = {
        ...lesson,
        status: 'up-to-date', // đánh dấu đã tải xong
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('lessonMeta', JSON.stringify(metaData));

      // 2️⃣ Cập nhật layout ngay lập tức
      setLessons(prevLessons =>
        prevLessons.map(l =>
          l.id === lesson.id
            ? { ...l, status: 'up-to-date', localHash: lesson.hash }
            : l,
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
      <Text style={styles.header}>Kiểm tra dữ liệu bài học</Text>
      {lessons.length === 0 ? (
        <Text style={styles.emptyText}>
          Không có bài học nào được kích hoạt trong Setting.
        </Text>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={item => item.id}
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
                    : item.status === 'corrupted'
                    ? '❌ Dữ liệu lỗi'
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Quay lại</Text>
      </TouchableOpacity>
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
    marginTop: 15,
    backgroundColor: '#888',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
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
