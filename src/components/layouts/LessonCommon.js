import React, { Suspense, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LessonRegistry } from '@lesson/LessonRegistry';
import { clearLazyModule } from '@utils/LazyLoader';

export default function LessonCommon({ lessonId, isColorRhythm }) {
  const [SectionComp, setSectionComp] = useState(null);
  const [sectionKey, setSectionKey] = useState(null);

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

  // 🧩 Hàm mở section (tìm trong registry)
  const openSection = sectionName => {
    try {
      // Lấy component lazy tương ứng
      const LazyComp = LessonRegistry[lessonId]?.[sectionName];

      if (!LazyComp) {
        console.warn(
          `[LessonCommon] Không tìm thấy section ${sectionName} trong ${lessonId}`,
        );
        return;
      }

      // Gán component vào state (để Suspense render)
      setSectionComp(() => LazyComp);
      setSectionKey(`${lessonId}-${sectionName}`);
    } catch (err) {
      console.error(`[LessonCommon] Lỗi khi mở ${sectionName}:`, err);
    }
  };

  // 🔙 Đóng section và xóa cache
  const closeSection = () => {
    if (sectionKey) clearLazyModule(sectionKey);
    setSectionComp(null);
    setSectionKey(null);
  };

  // ⚡ Nếu đang hiển thị 1 section thì render nó
  if (SectionComp) {
    const Comp = SectionComp;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={closeSection} style={styles.backButton}>
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
          {/* Truyền props tùy ý, như lessonId */}
          <Comp lessonId={lessonId} />
        </Suspense>
      </View>
    );
  }

  // ⚙️ Hàm render cặp Row3 theo loại bài học
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
            onPress={() => openSection('Rhythms')}
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
            onPress={() => openSection('ColorCoding')}
          >
            <Text style={styles.cardText}>Color Coding</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  // 🧱 Giao diện danh sách card section
  return (
    <View style={styles.container}>
      {/* Row 1: Greeting */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.Greeting }]}
          onPress={() => openSection('Greeting')}
        >
          <Text style={styles.cardText}>Greeting</Text>
        </TouchableOpacity>
      </View>

      {/* Row 2: Singing */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.Singing }]}
          onPress={() => openSection('Singing')}
        >
          <Text style={styles.cardText}>Singing</Text>
        </TouchableOpacity>
      </View>

      {/* Row 3: Cặp động */}
      <View style={[styles.row, styles.rowPair]}>{renderPairRow()}</View>

      {/* Row 4: Goodbye */}
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
});
