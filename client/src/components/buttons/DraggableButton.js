import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  measure,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { CircleButton } from '@components/buttons';

const DraggableButton = ({
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
}) => {
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
        x.value = withSpring(0);
        y.value = withSpring(0);
        return;
      }

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
        x.value = withSpring(0);
        y.value = withSpring(0);
      } else {
        runOnJS(lockButton)(id);
        runOnJS(onDropped)(color, audioFile, position);
        runOnJS(onDropSuccess)(targetIndex, { color, audioFile });
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
};

DraggableButton.displayName = 'DraggableButton';

DraggableButton.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string,
  audioFile: PropTypes.string,
  position: PropTypes.object.isRequired,
  dropRefs: PropTypes.array.isRequired,
  containerRef: PropTypes.object.isRequired,
  onDropped: PropTypes.func.isRequired,
  onDropSuccess: PropTypes.func.isRequired,
  occupiedDrops: PropTypes.array.isRequired,
  lockButton: PropTypes.func.isRequired,
  locked: PropTypes.bool,
};

export default DraggableButton;
