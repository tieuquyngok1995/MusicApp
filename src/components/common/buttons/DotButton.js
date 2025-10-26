import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const DotButton = ({
  dot,
  isDotConnected,
  draggedDotId,
  onPanResponderGrant,
  onPanResponderMove,
  onPanResponderRelease,
}) => {
  const getDotColor = () => {
    if (isDotConnected(dot.id)) return '#4CAF50';
    if (draggedDotId === dot.id) return '#2196F3';
    return dot.group === 'A' ? '#FF5722' : '#FF9800';
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(onPanResponderGrant)(dot);
    })
    .onUpdate(event => {
      runOnJS(onPanResponderMove)(dot, {
        dx: event.translationX,
        dy: event.translationY,
      });
    })
    .onEnd(event => {
      runOnJS(onPanResponderRelease)(dot, {
        dx: event.translationX,
        dy: event.translationY,
      });
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.dot,
          {
            left: dot.x - 20,
            top: dot.y - 20,
            backgroundColor: getDotColor(),
            opacity: isDotConnected(dot.id) ? 0.6 : 1,
          },
        ]}
      >
        <Text style={styles.dotText}>{dot.id}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  dotText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DotButton;
