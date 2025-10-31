import { useCallback, useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '@contexts/AppContext';
import { LessonCard, RoleDialog } from '@screens';
import { AppButton } from '@components/buttons';
import img from '@assets/images/image.jpg';

const bottomBarHeight = 60;
const ITEM_HEIGHT = 160; // chiều cao ước lượng 1 card (image + text)

const HomeScreen = () => {
  const navigation = useNavigation();
  const { role, setRole } = useAppContext();

  const [showDialog, setShowDialog] = useState(false);
  const [lessons, setLessons] = useState([]);

  // ⚙️ Mở chọn role nếu chưa có
  useEffect(() => {
    if (!role) setShowDialog(true);
  }, [role]);

  const handleSelectRole = selectedRole => {
    setRole(selectedRole);
    setShowDialog(false);
  };

  // 🧠 Hàm tải danh sách bài học từ AsyncStorage
  const loadLessonsFromStorage = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('lessonsData');
      if (saved) {
        const parsed = JSON.parse(saved);

        // đảm bảo có cờ active (phòng khi chưa có)
        const updated = parsed.map(l => ({
          ...l,
          active: l.active ?? true,
        }));

        setLessons(updated);
      } else {
        // Nếu chưa chọn gì, tạo danh sách mặc định (tất cả inactive)
        const defaultLessons = Array.from({ length: 10 }).map((_, i) => ({
          id: `lesson${(i + 1).toString().padStart(3, '0')}`,
          title: `Bài học ${i + 1}`,
          description: `Mô tả cho bài học ${i + 1}`,
          isColorRhythm: i / 2 !== 0,
          image: img,
          active: false,
        }));
        setLessons(defaultLessons);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài học:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách bài học');
    }
  }, []);

  // 🔁 Tải lại danh sách mỗi khi quay về từ Setting
  useFocusEffect(
    useCallback(() => {
      loadLessonsFromStorage();
    }, [loadLessonsFromStorage]),
  );

  // 🏎 Mở màn hình bài học
  const handlePress = useCallback(
    lesson => {
      console.log('Bấm vào bài học:', lesson.title, lesson.id);
      navigation.navigate('Lesson', {
        lessonId: lesson.id,
        isColorRhythm: lesson.isColorRhythm,
      });
    },
    [navigation],
  );

  // ⚙️ Mở Setting
  const handleSettings = useCallback(() => {
    console.log('Mở màn hình Settings');
    navigation.navigate('Setting');
  }, [navigation]);

  // ⚙️ Mở Update
  const handleUpdate = useCallback(() => {
    console.log('Mở màn hình Update');
    navigation.navigate('Update');
  }, []);

  // ⚡ Tối ưu FlatList
  const getItemLayout = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  // 🧩 Lọc chỉ lấy bài học active
  const activeLessons = lessons.filter(item => item.active);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <RoleDialog
        visible={showDialog}
        onSelectRole={handleSelectRole}
        onClose={() => setShowDialog(false)}
      />

      <FlatList
        data={activeLessons}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <LessonCard lesson={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={{
          paddingLeft: 10,
          paddingBottom: bottomBarHeight,
        }}
        removeClippedSubviews={true}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        getItemLayout={getItemLayout}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            Chưa có bài học nào được kích hoạt trong Setting.
          </Text>
        )}
      />

      <View style={styles.bottomBar}>
        <AppButton title="Settings" onPress={handleSettings} mode="primary" />
        <AppButton
          title="Update"
          onPress={handleUpdate}
          mode="primary"
          style={[{ backgroundColor: '#e67e22' }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default HomeScreen;
