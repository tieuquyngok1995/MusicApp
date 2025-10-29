import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const NoteButton = ({ soundSource, imageSource, style }) => {
  const playSound = () => {
    const noteSound = new Sound(soundSource, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      noteSound.play(success => {
        if (!success) {
          console.log('Sound playback failed');
        }
        noteSound.release(); // Giải phóng bộ nhớ
      });
    });
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={playSound}>
      <Image source={imageSource} style={[styles.noteImage, style]} />
    </TouchableOpacity>
  );
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
