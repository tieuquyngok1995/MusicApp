import { useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAnimatedRef } from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { DropCircle, DraggableButton } from '@components/buttons';
import { DotLabel } from '@components/labels';
import { styles } from './styles';

export default function ExerciseColorNotes({
  dropPositions = [],
  initialButtons = [],
  styleOverrides = {},
}) {
  const containerRef = useAnimatedRef();
  const dropRefs = dropPositions.map(() => useAnimatedRef());
  const [buttons, setButtons] = useState(initialButtons);
  const [occupiedDrops, setOccupiedDrops] = useState({});

  const handleDropSuccess = (dropIndex, buttonInfo) => {
    setOccupiedDrops(prev => ({
      ...prev,
      [dropIndex]: buttonInfo,
    }));
  };

  const handleDrop = (id, originalPosition) => {
    setButtons(prev =>
      prev.map(btn =>
        btn.id === id ? { ...btn, position: originalPosition } : btn,
      ),
    );
  };

  const lockButton = id => {
    setButtons(prev =>
      prev.map(btn => (btn.id === id ? { ...btn, locked: true } : btn)),
    );
  };

  return (
    <GestureHandlerRootView
      style={[styles.container, styleOverrides.container]}
    >
      <View
        ref={containerRef}
        style={[styles.innerContainer, styleOverrides.container]}
      >
        <View style={[styles.dropsContainer, styleOverrides.container]}>
          {dropRefs.map((ref, idx) => {
            return (
              <View key={idx}>
                <DropCircle
                  ref={ref}
                  style={[
                    styles.dropCirclePosition,
                    dropPositions[idx].position,
                    styleOverrides,
                  ]}
                />
                <DotLabel
                  text={dropPositions[idx].text}
                  style={[
                    styles.colorNotesLabel,
                    dropPositions[idx].position,
                    styleOverrides,
                  ]}
                />
              </View>
            );
          })}
        </View>

        <View style={[styles.buttonsContainer, styleOverrides.container]}>
          {buttons.map(btn => (
            <DraggableButton
              key={btn.id}
              {...btn}
              dropRefs={dropRefs}
              containerRef={containerRef}
              onDropped={handleDrop}
              onDropSuccess={handleDropSuccess}
              occupiedDrops={occupiedDrops}
              lockButton={lockButton}
            />
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
ExerciseColorNotes.propTypes = {
  dropPositions: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  ),
  initialButtons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      color: PropTypes.string,
      audioFile: PropTypes.string,
      position: PropTypes.object,
    }),
  ),
  styleOverrides: PropTypes.object,
};
