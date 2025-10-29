import { StyleSheet, Pressable } from 'react-native';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';

const CircleButton = ({ color = '#3498db', audioFile, style }) => {
  const playAudio = () => {
    if (!audioFile) return;

    const sound = new Sound(audioFile, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.warn('Không thể phát âm thanh:', error);
        return;
      }
      sound.play(success => {
        if (!success) {
          console.warn('Phát âm thanh thất bại');
        }
        sound.release();
      });
    });
  };

  return (
    <Pressable
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={playAudio}
      android_disableSound={true}
    />
  );
};

CircleButton.propTypes = {
  color: PropTypes.string,
  audioFile: PropTypes.string.isRequired,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default CircleButton;
