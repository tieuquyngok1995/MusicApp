import React, { Suspense, lazy, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Module cache để quản lý lazy component
const moduleCache = {};

// Hàm load module lazy với quản lý cache
function loadLazyModule(importFn, key) {
  if (moduleCache[key]) {
    console.log('[Lazy] Reusing cached module:', key);
    return moduleCache[key];
  }
  const LazyComp = lazy(() =>
    importFn().then(mod => {
      moduleCache[key] = { default: mod.default };
      return mod;
    }),
  );
  moduleCache[key] = LazyComp;
  return LazyComp;
}

// Hàm clear module khỏi cache
function clearLazyModule(key) {
  console.log('[Lazy] Clearing module cache:', key);
  delete moduleCache[key];
}

// Map các bài học với import function
const layoutImports = {
  lesson001: () => import('../components/LessonContent1'),
  lesson002: () => import('../components/LessonContent2'),
};

export default function LessonScreen({ lessonId, lessonData }) {
  const [Layout, setLayout] = useState(null);
  const navigation = useNavigation();

  console.log(moduleCache.size);

  // Load lazy component khi lessonId thay đổi
  useEffect(() => {
    if (!layoutImports[lessonId]) {
      setLayout(null);
      return;
    }

    const LazyComp = loadLazyModule(layoutImports[lessonId], lessonId);
    setLayout(() => LazyComp);

    return () => {
      // Clear module khi unmount để giải phóng memory
      clearLazyModule(lessonId);
      setLayout(null);
    };
  }, [lessonId]);

  const goHome = () => {
    console.log('moduleCache');
    console.log(moduleCache);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (!Layout)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bài học không tồn tại</Text>
        <Button title="Quay lại" onPress={goHome} />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <Button title="Quay lại" onPress={goHome} />
      <Suspense
        fallback={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color="#3498db" />
            <Text>Đang tải bài học...</Text>
          </View>
        }
      >
        <Layout data={lessonData} />
      </Suspense>
    </View>
  );
}
