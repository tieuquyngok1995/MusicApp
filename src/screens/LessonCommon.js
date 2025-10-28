import { Suspense, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LessonRegistry } from '@lessons/LessonRegistry';
import { clearLazyModule, clearAllLazyModules } from '@utils/LazyLoader';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '@contexts/AppContext';

export default function LessonCommon({ lessonId, isColorRhythm }) {
  const [sectionProps, setSectionProps] = useState({});
  const [SectionComp, setSectionComp] = useState(null);
  const [sectionKey, setSectionKey] = useState(null);
  const navigation = useNavigation();

  const { role } = useAppContext();

  // 🎨 Màu cố định cho mỗi phần
  const colors = {
    Greeting: '#FFCC80',
    Singing: '#81C784',
    StoryTime: '#64B5F6',
    ColorCoding: '#BA68C8',
    ColorIdentifying: '#FFD54F',
    Rhythms: '#4DB6AC',
    Goodbye: '#E57373',
  };

  // 🎯 Auto-open ColorCoding cho student
  useEffect(() => {
    if (role === 'student' && !SectionComp) {
      console.log(
        '[LessonCommon] Student detected, auto-opening ColorCoding...',
      );
      if (isColorRhythm) {
        openSection('ExercisesRhythms');
      } else {
        openSection('ExercisesColorCoding');
      }
    }
  }, [role, SectionComp]);

  // 🧩 Hàm mở section với xử lý lỗi
  const openSection = (sectionName, props = {}) => {
    try {
      // Kiểm tra lesson tồn tại
      if (!LessonRegistry[lessonId]) {
        console.error(
          `[LessonCommon] Không tìm thấy lesson dang ky trong Lesson Registry"${lessonId}"`,
        );
        return;
      }

      // Lấy component lazy
      const LazyComp = LessonRegistry[lessonId]?.[sectionName];

      if (!LazyComp) {
        console.warn(
          `[LessonCommon] Không tìm thấy section "${sectionName}" trong "${lessonId}"`,
        );
        return;
      }

      console.log(`[LessonCommon] Đang mở ${sectionName}...`);
      setSectionComp(() => LazyComp);
      setSectionKey(`${lessonId}-${sectionName}`);
      setSectionProps(props);
    } catch (err) {
      console.error(`[LessonCommon] Lỗi khi mở ${sectionName}:`, err);
    }
  };

  const handleBackPress = () => {
    if (role === 'student') {
      console.log('[LessonCommon] Student mode - Quay về Home');
      goHome();
    } else {
      closeSection();
    }
  };

  // 🔙 Đóng section
  const closeSection = () => {
    console.log(`[LessonCommon] Đóng section: ${sectionKey}`);
    if (sectionKey) clearLazyModule(sectionKey);
    setSectionComp(null);
    setSectionKey(null);
    setSectionProps({});
  };

  const goHome = () => {
    try {
      clearAllLazyModules();
      setSectionComp(null);
      setSectionKey(null);
      setSectionProps({});
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error('[LessonCommon] Lỗi khi quay lại Home:', err);
    }
  };

  // ⚡ Hiển thị section đã mở
  if (SectionComp) {
    const Comp = SectionComp;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Quay lại</Text>
        </TouchableOpacity>

        <Suspense
          fallback={
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text>Đang tải nội dung...</Text>
            </View>
          }
        >
          <Comp lessonId={lessonId} {...sectionProps} />
        </Suspense>
      </View>
    );
  }

  // 🔄 Loading cho student
  if (role === 'student') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Đang tải bài học...</Text>
      </View>
    );
  }

  // ⚙️ Render cặp Row3
  const renderPairRow = () => {
    if (isColorRhythm) {
      return (
        <>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.ColorIdentifying }]}
            onPress={() => openSection('ColorIdentifying')}
          >
            <Text style={styles.cardText}>Color Identifying</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.Rhythms }]}
            onPress={() => openSection('LessonRhythms')}
          >
            <Text style={styles.cardText}>Rhythms</Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.StoryTime }]}
            onPress={() => openSection('StoryTime')}
          >
            <Text style={styles.cardText}>Story Time</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.ColorCoding }]}
            onPress={() => openSection('LessonColorCoding')}
          >
            <Text style={styles.cardText}>Color Coding</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  // 🧱 Danh sách sections (teacher)
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goHome} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Quay lại</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.Greeting }]}
          onPress={() =>
            openSection('Greeting', {
              videoUri: require('@assets/videos/P.1_Hello Song.mp4'),
              lyrics: 'test 123',
            })
          }
        >
          <Text style={styles.cardText}>Greeting</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.Singing }]}
          onPress={() => openSection('Singing')}
        >
          <Text style={styles.cardText}>Singing</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.row, styles.rowPair]}>{renderPairRow()}</View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.Goodbye }]}
          onPress={() => openSection('Goodbye')}
        >
          <Text style={styles.cardText}>Goodbye</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 2,
  },
  rowPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginHorizontal: 2,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: 'blue',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 10,
  },
  homeText: {
    color: '#fff',
    fontSize: 16,
  },
});
