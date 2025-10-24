import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useAnimatedRef, measure, runOnJS } from 'react-native-reanimated';
import CircleButton from './common/CircleButton';
import DropCircle from './common/DropCircle';
import Colors from '../constants/Colors';
import Audios from '../constants/Audios';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function LessonContent1() {
  const containerRef = useAnimatedRef();
  const dropRefs = [
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
    useAnimatedRef(),
  ];
  const dropPositions = [
    { top: 300, left: 50 },
    { top: 300, left: 150 },
    { top: 300, left: 250 },
    { top: 300, left: 350 },
    { top: 200, left: 400 },
    { top: 200, left: 500 },
    { top: 200, left: 600 },
    { top: 200, left: 700 },
    { top: 300, left: 750 },
    { top: 300, left: 850 },
    { top: 200, left: 900 },
    { top: 200, left: 1000 },
    { top: 300, left: 1050 },
  ];

  const [buttons, setButtons] = useState([
    {
      id: 'b1',
      color: Colors.C,
      audioFile: Audios.C,
      position: { top: 500, left: 100 },
      locked: false,
    },
    {
      id: 'b2',
      color: Colors.D,
      audioFile: Audios.D,
      position: { top: 500, left: 250 },
      locked: false,
    },
    {
      id: 'b3',
      color: Colors.E,
      audioFile: Audios.E,
      position: { top: 500, left: 400 },
      locked: false,
    },
    {
      id: 'b4',
      color: Colors.F,
      audioFile: Audios.F,
      position: { top: 500, left: 550 },
      locked: false,
    },
    {
      id: 'b5',
      color: Colors.G,
      audioFile: Audios.G,
      position: { top: 500, left: 700 },
      locked: false,
    },
    {
      id: 'b6',
      color: Colors.A,
      audioFile: Audios.A,
      position: { top: 500, left: 850 },
      locked: false,
    },
    {
      id: 'b7',
      color: Colors.B,
      audioFile: Audios.B,
      position: { top: 500, left: 1000 },
      locked: false,
    },
  ]);

  const [occupiedDrops, setOccupiedDrops] = useState({});

  const handleDropSuccess = (dropIndex, buttonInfo) => {
    setOccupiedDrops(prev => ({
      ...prev,
      [dropIndex]: buttonInfo, // Lưu nút nào ở drop nào
    }));
  };
  const handleDrop = (color, audioFile, originalPosition) => {
    const newId = `b${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setButtons(prev => [
      ...prev,
      {
        id: newId,
        color,
        audioFile,
        position: originalPosition,
      },
    ]);
  };
  const lockButton = id => {
    setButtons(prev =>
      prev.map(btn => (btn.id === id ? { ...btn, locked: true } : btn)),
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View ref={containerRef} style={styles.innerContainer}>
        <View style={styles.dropsContainer}>
          {dropRefs.map((ref, idx) => (
            <DropCircle
              key={idx}
              ref={ref}
              style={[styles.dropCirclePosition, dropPositions[idx]]}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          {buttons.map(btn => (
            <DraggableButton
              key={btn.id}
              id={btn.id}
              color={btn.color}
              audioFile={btn.audioFile}
              position={btn.position}
              dropRefs={dropRefs}
              containerRef={containerRef}
              onDropped={handleDrop}
              onDropSuccess={handleDropSuccess}
              occupiedDrops={occupiedDrops}
              lockButton={lockButton}
              locked={btn.locked}
            />
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

function DraggableButton({
  id,
  color,
  audioFile,
  position,
  dropRefs,
  containerRef,
  onDropped,
  onDropSuccess,
  occupiedDrops,
  lockButton,
  locked,
}) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = Gesture.Pan()
    .enabled(!locked)
    .onBegin(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate(event => {
      x.value = startX.value + event.translationX;
      y.value = startY.value + event.translationY;
    })
    .onEnd(event => {
      'worklet';
      let dropped = false;
      let targetIndex = -1;

      const containerLayout = measure(containerRef);
      if (!containerLayout) {
        // không đo đc container — trả về vị trí gốc
        x.value = withSpring(0);
        y.value = withSpring(0);
        return;
      }

      // Duyệt các drop refs để kiểm tra khoảng cách
      for (let i = 0; i < dropRefs.length; i++) {
        const ref = dropRefs[i];
        const layout = measure(ref);
        if (!layout) continue;

        const { width, height, pageX, pageY } = layout;
        const centerX = pageX + width / 2;
        const centerY = pageY + height / 2;

        const dist = Math.sqrt(
          (event.absoluteX - centerX) ** 2 + (event.absoluteY - centerY) ** 2,
        );

        if (dist <= width / 2 + 45 && !occupiedDrops[i]) {
          const newX =
            pageX - containerLayout.pageX + width / 2 - 45 - position.left;
          const newY =
            pageY - containerLayout.pageY + height / 2 - 45 - position.top;

          x.value = withSpring(newX);
          y.value = withSpring(newY);
          dropped = true;
          targetIndex = i;
          break;
        }
      }

      if (!dropped) {
        // trở về vị trí gốc
        x.value = withSpring(0);
        y.value = withSpring(0);
      } else {
        runOnJS(lockButton)(id);

        runOnJS(onDropped)(color, audioFile, position);

        const buttonInfo = { color, audioFile };
        runOnJS(onDropSuccess)(targetIndex, buttonInfo);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    position: 'absolute',
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[animatedStyle]}>
        <CircleButton color={color} audioFile={audioFile} style={[position]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  dropsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  dropCirclePosition: {
    position: 'absolute',
  },
  buttonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
