import React, { useState, useCallback, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import PropTypes from 'prop-types';
import { DotButton, CircleButton } from '@components/buttons';
import { DotLabel } from '@components/labels';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

// Tạo Animated Line component
const AnimatedLine = Animated.createAnimatedComponent(Line);

export default function ExerciseMatchColors({
  dotsA = [],
  dotsB = [],
  styleOverrides = {},
}) {
  const allDots = useMemo(() => [...dotsA, ...dotsB], [dotsA, dotsB]);
  const [connections, setConnections] = useState([]);
  const [draggedDotId, setDraggedDotId] = useState(null);
  const [startDot, setStartDot] = useState(null);

  // Shared values cho line animation (chạy trên UI thread)
  const lineX1 = useSharedValue(0);
  const lineY1 = useSharedValue(0);
  const lineX2 = useSharedValue(0);
  const lineY2 = useSharedValue(0);
  const isDrawing = useSharedValue(false);

  const connectedDotsSet = useMemo(() => {
    const set = new Set();
    connections.forEach(c => {
      set.add(c.startId);
      set.add(c.endId);
    });
    return set;
  }, [connections]);

  const isDotConnected = useCallback(
    dotId => connectedDotsSet.has(dotId),
    [connectedDotsSet],
  );

  const canConnect = useCallback((dot1, dot2) => dot1.group !== dot2.group, []);

  const isNearDot = useCallback((x, y, dot) => {
    const dx = x - dot.x;
    const dy = y - dot.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared < 2500;
  }, []);

  const handlePanResponderGrant = useCallback(
    dot => {
      if (isDotConnected(dot.id)) return;
      setDraggedDotId(dot.id);
      setStartDot(dot);

      // Cập nhật trực tiếp trên UI thread
      lineX1.value = dot.x;
      lineY1.value = dot.y;
      lineX2.value = dot.x;
      lineY2.value = dot.y;
      isDrawing.value = true;
    },
    [isDotConnected, lineX1, lineY1, lineX2, lineY2, isDrawing],
  );

  const handlePanResponderMove = useCallback(
    (dot, gestureState) => {
      if (isDotConnected(dot.id)) return;

      // Cập nhật trực tiếp trên UI thread - KHÔNG CÓ setState
      lineX2.value = dot.x + gestureState.dx;
      lineY2.value = dot.y + gestureState.dy;
    },
    [isDotConnected, lineX2, lineY2],
  );

  const addConnection = useCallback((dot, targetDot) => {
    const newConnection = {
      id: `${dot.id}-${targetDot.id}`,
      startId: dot.id,
      endId: targetDot.id,
      x1: dot.x,
      y1: dot.y,
      x2: targetDot.x,
      y2: targetDot.y,
    };
    setConnections(prev => [...prev, newConnection]);
  }, []);

  const handlePanResponderRelease = useCallback(
    (dot, gestureState) => {
      if (isDotConnected(dot.id)) return;

      const endX = dot.x + gestureState.dx;
      const endY = dot.y + gestureState.dy;

      const targetDot = allDots.find(
        d =>
          d.id !== dot.id &&
          !isDotConnected(d.id) &&
          canConnect(dot, d) &&
          isNearDot(endX, endY, d),
      );

      if (targetDot) {
        addConnection(dot, targetDot);
      }

      // Reset drawing state
      isDrawing.value = false;
      setDraggedDotId(null);
      setStartDot(null);
    },
    [allDots, isDotConnected, canConnect, isNearDot, addConnection, isDrawing],
  );

  // Animated props cho line đang vẽ
  const animatedLineProps = useAnimatedProps(() => ({
    x1: lineX1.value,
    y1: lineY1.value,
    x2: lineX2.value,
    y2: lineY2.value,
    opacity: isDrawing.value ? 1 : 0,
  }));

  return (
    <GestureHandlerRootView style={[styles.container, styleOverrides]}>
      <View>
        <Svg height={height} width={width} style={styles.svg}>
          {/* Lines đã hoàn thành */}
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

          {/* Line đang vẽ - Animated với Reanimated */}
          <AnimatedLine
            animatedProps={animatedLineProps}
            stroke="#2196F3"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </Svg>

        {allDots.map(dot =>
          dot.group === 'A' ? (
            <React.Fragment key={dot.id}>
              <CircleButton
                color={dot.color}
                audioFile={dot.audioFile}
                style={{
                  position: 'absolute',
                  left: dot.x - 45,
                  top: dot.y - 120,
                }}
              />
              <DotButton
                dot={dot}
                isDotConnected={isDotConnected}
                draggedDotId={draggedDotId}
                onPanResponderGrant={handlePanResponderGrant}
                onPanResponderMove={handlePanResponderMove}
                onPanResponderRelease={handlePanResponderRelease}
              />
            </React.Fragment>
          ) : (
            <React.Fragment key={dot.id}>
              <DotButton
                dot={dot}
                isDotConnected={isDotConnected}
                draggedDotId={draggedDotId}
                onPanResponderGrant={handlePanResponderGrant}
                onPanResponderMove={handlePanResponderMove}
                onPanResponderRelease={handlePanResponderRelease}
              />
              <DotLabel
                text={dot.text}
                style={{ left: dot.x - 30, top: dot.y + 30 }}
              />
            </React.Fragment>
          ),
        )}
      </View>
    </GestureHandlerRootView>
  );
}

ExerciseMatchColors.propTypes = {
  dotsA: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      group: PropTypes.string.isRequired,
      color: PropTypes.string,
      audioFile: PropTypes.any,
    }),
  ),
  dotsB: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      group: PropTypes.string.isRequired,
      text: PropTypes.string,
    }),
  ),
  styleOverrides: PropTypes.object,
};
