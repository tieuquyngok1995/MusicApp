import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Line } from 'react-native-svg';
import { DotButton, CircleButton } from '@components/buttons';
import { Colors, Audios } from '@constants';

const { width, height } = Dimensions.get('window');

export default function ExercisesColorCoding() {
  const [dotsA] = useState([
    {
      id: 'A1',
      x: 125,
      y: 220,
      group: 'A',
      color: Colors.C,
      audioFile: Audios.C,
    },
    {
      id: 'A2',
      x: 325,
      y: 220,
      group: 'A',
      color: Colors.D,
      audioFile: Audios.D,
    },
    {
      id: 'A3',
      x: 525,
      y: 220,
      group: 'A',
      color: Colors.E,
      audioFile: Audios.E,
    },
    {
      id: 'A4',
      x: 725,
      y: 220,
      group: 'A',
      color: Colors.C,
      audioFile: Audios.C,
    },
    {
      id: 'A5',
      x: 925,
      y: 220,
      group: 'A',
      color: Colors.A,
      audioFile: Audios.A,
    },
    {
      id: 'A6',
      x: 1125,
      y: 220,
      group: 'A',
      color: Colors.B,
      audioFile: Audios.B,
    },
  ]);

  const [dotsB] = useState([
    { id: 'B1', x: 125, y: 450, group: 'B', text: 'C' },
    { id: 'B2', x: 325, y: 450, group: 'B', text: 'A' },
    { id: 'B3', x: 525, y: 450, group: 'B', text: 'C' },
    { id: 'B4', x: 725, y: 450, group: 'B', text: 'D' },
    { id: 'B5', x: 925, y: 450, group: 'B', text: 'E' },
    { id: 'B6', x: 1125, y: 450, group: 'B', text: 'B' },
  ]);

  const allDots = [...dotsA, ...dotsB];
  const [connections, setConnections] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [draggedDotId, setDraggedDotId] = useState(null);

  const isDotConnected = dotId =>
    connections.some(c => c.startId === dotId || c.endId === dotId);

  const canConnect = (dot1, dot2) => dot1.group !== dot2.group;

  const isNearDot = (x, y, dot) => {
    const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
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
        <Svg height={height} width={width} style={styles.svg}>
          {connections.map(c => (
            <Line
              key={c.id}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="#000000"
              strokeWidth="2"
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

        {allDots.map(dot =>
          dot.group === 'A' ? (
            <React.Fragment key={dot.id}>
              <CircleButton
                {...{
                  color: dot.color,
                  audioFile: dot.audioFile,
                  style: {
                    position: 'absolute',
                    left: dot.x - 45,
                    top: dot.y - 120,
                  },
                }}
                key={`${dot.id}-circle`}
              />
              <DotButton
                {...{
                  dot,
                  isDotConnected,
                  draggedDotId,
                  onPanResponderGrant: handlePanResponderGrant,
                  onPanResponderMove: handlePanResponderMove,
                  onPanResponderRelease: handlePanResponderRelease,
                }}
                key={`${dot.id}-dot`}
              />
            </React.Fragment>
          ) : (
            <React.Fragment key={dot.id}>
              <DotButton
                key={`${dot.id}-dot`}
                dot={dot}
                isDotConnected={isDotConnected}
                draggedDotId={draggedDotId}
                onPanResponderGrant={handlePanResponderGrant}
                onPanResponderMove={handlePanResponderMove}
                onPanResponderRelease={handlePanResponderRelease}
              />
              <View
                style={[
                  styles.labelBubble,
                  {
                    left: dot.x - 30,
                    top: dot.y + 30,
                  },
                ]}
              >
                <Text style={styles.labelText}>{dot.text}</Text>
              </View>
            </React.Fragment>
          ),
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  svg: { position: 'absolute', top: 0, left: 0 },
  circlePosition: { position: 'absolute' },
  labelBubble: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1.5,
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  labelText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 32,
    color: '#000',
  },
});
