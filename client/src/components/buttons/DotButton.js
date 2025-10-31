import { StyleSheet } from 'react-native';
import Animated, { runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const DotButton = ({
  dot,
  isDotConnected,
  draggedDotId,
  onPanResponderGrant,
  onPanResponderMove,
  onPanResponderRelease,
}) => {
  const getDotColor = () => {
    if (isDotConnected(dot.id)) return '#000000';
    if (draggedDotId === dot.id) return '#2196F3';
    return dot.group === 'A' ? '#FF5722' : '#FF9800';
  };

  const pan = Gesture.Pan()
    .onBegin(() => runOnJS(onPanResponderGrant)(dot))
    .onUpdate(event =>
      runOnJS(onPanResponderMove)(dot, {
        dx: event.translationX,
        dy: event.translationY,
      }),
    )
    .onEnd(event =>
      runOnJS(onPanResponderRelease)(dot, {
        dx: event.translationX,
        dy: event.translationY,
      }),
    );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.dot,
          {
            left: dot.x - 16,
            top: dot.y - 16,
            backgroundColor: getDotColor(),
            opacity: 1,
          },
        ]}
      />
    </GestureDetector>
  );
};

DotButton.propTypes = {
  dot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    group: PropTypes.string.isRequired,
  }).isRequired,
  isDotConnected: PropTypes.func.isRequired,
  draggedDotId: PropTypes.string,
  onPanResponderGrant: PropTypes.func.isRequired,
  onPanResponderMove: PropTypes.func.isRequired,
  onPanResponderRelease: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
