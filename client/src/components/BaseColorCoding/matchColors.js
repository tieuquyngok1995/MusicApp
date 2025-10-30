import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Line } from 'react-native-svg';
import PropTypes from 'prop-types';
import { DotButton, CircleButton } from '@components/buttons';
import { DotLabel } from '@components/labels';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

export default function ExerciseMatchColors({
  dotsA = [],
  dotsB = [],
  styleOverrides = {},
}) {
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
    if (isDotConnected(dot.id)) return;
    setDraggedDotId(dot.id);
    setCurrentLine({
      x1: dot.x,
      y1: dot.y,
      x2: dot.x,
      y2: dot.y,
    });
  };

  const handlePanResponderMove = (dot, gestureState) => {
    if (isDotConnected(dot.id)) return;
    const newX = dot.x + gestureState.dx;
    const newY = dot.y + gestureState.dy;
    setCurrentLine(() => ({
      x1: dot.x,
      y1: dot.y,
      x2: newX,
      y2: newY,
    }));
  };

  const handlePanResponderRelease = (dot, gestureState) => {
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
    }

    setCurrentLine(null);
    setDraggedDotId(null);
  };

  return (
    <GestureHandlerRootView style={[styles.container, styleOverrides]}>
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
