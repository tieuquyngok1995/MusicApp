import { useState } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { CircleButton } from '@components/buttons';
import { styles } from './styles';

export default function ExerciseWriteNotes({
  initialButtons = [],
  styleOverrides = {},
}) {
  const [note, setNotes] = useState('');

  const handleChangeText = (text, index) => {
    const char = text.toLowerCase().match(/[a-z]/);
    if (char) {
      setNotes(prev => {
        const newNotes = [...prev];
        newNotes[index] = char[0].toUpperCase();
        return newNotes;
      });
    } else {
      setNotes(prev => {
        const newNotes = [...prev];
        newNotes[index] = '';
        return newNotes;
      });
    }
  };

  return (
    <View style={styles.container}>
      {initialButtons.map((btn, index) => (
        <View
          key={index}
          style={[styles.writeNotesButton, btn.position, styleOverrides]}
        >
          <CircleButton
            color={btn.color}
            audioFile={btn.audioFile}
            style={styleOverrides}
          />
          <TextInput
            style={[styles.writeNotesInput, styleOverrides]}
            value={btn.note}
            onChangeText={text => handleChangeText(text, index)}
            maxLength={1}
            autoCapitalize="characters"
          />
        </View>
      ))}
    </View>
  );
}

ExerciseWriteNotes.propTypes = {
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
