import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Line } from 'react-native-svg';
import Dot from '../common/buttons/DotButton';

const { width, height } = Dimensions.get('window');

export default function LessonContent2() {
  const [dotsA] = useState([
    { id: 'A1', x: 400, y: 150, group: 'A' },
    { id: 'A2', x: 400, y: 250, group: 'A' },
    { id: 'A3', x: 400, y: 350, group: 'A' },
    { id: 'A4', x: 400, y: 450, group: 'A' },
    { id: 'A5', x: 400, y: 550, group: 'A' },
  ]);

  const [dotsB] = useState([
    { id: 'B1', x: width - 80, y: 150, group: 'B' },
    { id: 'B2', x: width - 80, y: 250, group: 'B' },
    { id: 'B3', x: width - 80, y: 350, group: 'B' },
    { id: 'B4', x: width - 80, y: 450, group: 'B' },
    { id: 'B5', x: width - 80, y: 550, group: 'B' },
  ]);

  const allDots = [...dotsA, ...dotsB];
  const [connections, setConnections] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [draggedDotId, setDraggedDotId] = useState(null);

  // Kiểm tra dot đã kết nối
  const isDotConnected = dotId => {
    return connections.some(c => c.startId === dotId || c.endId === dotId);
  };

  const canConnect = (dot1, dot2) => {
    return dot1.group !== dot2.group;
  };

  const isNearDot = (x, y, dot) => {
    const distance = Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2));
    return distance < 50;
  };

  const handlePanResponderGrant = dot => {
    if (isDotConnected(dot.id)) return; // ngăn kéo nếu dot đã kết nối
    console.log('Bắt đầu kéo dot:', dot.id);
    setDraggedDotId(dot.id);
    setCurrentLine({
      x1: dot.x,
      y1: dot.y,
      x2: dot.x,
      y2: dot.y,
    });
  };

  const handlePanResponderMove = (dot, gestureState) => {
    if (isDotConnected(dot.id)) return; // ngăn kéo nếu dot đã kết nối
    const newX = dot.x + gestureState.dx;
    const newY = dot.y + gestureState.dy;
    setCurrentLine(prev => ({
      x1: dot.x,
      y1: dot.y,
      x2: newX,
      y2: newY,
    }));
  };

  const handlePanResponderRelease = (dot, gestureState) => {
    if (isDotConnected(dot.id)) return; // ngăn kéo nếu dot đã kết nối
    const endX = dot.x + gestureState.dx;
    const endY = dot.y + gestureState.dy;

    console.log('Thả tại:', endX, endY);

    const targetDot = allDots.find(
      d =>
        d.id !== dot.id &&
        !isDotConnected(d.id) &&
        canConnect(dot, d) &&
        isNearDot(endX, endY, d),
    );

    if (targetDot) {
      console.log('Kết nối thành công:', dot.id, '->', targetDot.id);
      const newConnection = {
        id: `${dot.id}-${targetDot.id}`,
        startId: dot.id,
        endId: targetDot.id,
        x1: dot.x,
        y1: dot.y,
        x2: targetDot.x,
        y2: targetDot.y,
      };
      console.log('Trước khi set:', connections);
      setConnections(prev => [...prev, newConnection]);
      console.log('Sau khi set:', connections);
    }
    console.log('Không kết nối - xóa line');
    setCurrentLine(null);
    setDraggedDotId(null);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <Text style={styles.title}>Kéo từ A sang B hoặc ngược lại</Text>

        <Svg height={height} width={width} style={styles.svg}>
          {connections.map(c => (
            <Line
              key={c.id}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="#4CAF50"
              strokeWidth="4"
            />
          ))}

          {currentLine && (
            <Line
              x1={currentLine.x1}
              y1={currentLine.y1}
              x2={currentLine.x2}
              y2={currentLine.y2}
              stroke="#2196F3"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          )}
        </Svg>

        {allDots.map(dot => (
          <Dot
            key={dot.id}
            dot={dot}
            isDotConnected={isDotConnected}
            draggedDotId={draggedDotId}
            onPanResponderGrant={handlePanResponderGrant}
            onPanResponderMove={handlePanResponderMove}
            onPanResponderRelease={handlePanResponderRelease}
          />
        ))}

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            Đã kết nối: {connections.length}/{dotsA.length}
          </Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    zIndex: 10,
  },
  svg: { position: 'absolute', top: 0, left: 0 },
  counter: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },
  counterText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
});
