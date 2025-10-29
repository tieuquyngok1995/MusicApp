import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';

const NoteButton = ({ soundSource, imageSource, style }) => {
  const playSound = () => {
    if (!soundSource) return;

    const noteSound = new Sound(soundSource, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      noteSound.play(success => {
        if (!success) {
          console.log('Sound playback failed');
        }
        noteSound.release();
      });
    });
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={playSound}>
      <Image source={imageSource} style={styles.noteImage} />
    </TouchableOpacity>
  );
};

NoteButton.propTypes = {
  soundSource: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  imageSource: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ uri: PropTypes.string }),
  ]).isRequired,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default NoteButton;
