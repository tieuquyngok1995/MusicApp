import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { NoteButton } from '@components/buttons';
import { Audios } from '@constants';
import { BStar, WStar, NoteCrotchet } from '@icons';
import BackgroundImg from '@assets/images/lesson2-rhythms.jpg';

export default function LessonRhythms() {
  return (
    <ImageBackground source={BackgroundImg} style={styles.background}>
      <View style={styles.container}>
        {/* Nốt nhạc */}
        <NoteButton
          soundSource={Audios.NOTE}
          imageSource={NoteCrotchet}
          style={styles.noteButton}
        />
        {/* 3 text dưới nút */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>Tah - an</Text>
          <Text style={styles.text}>1 - 2</Text>
          <View style={styles.iconRow}>
            <Image source={BStar} style={styles.icon} />
            <Image source={WStar} style={styles.icon} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // cover toàn màn hình
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteButton: {
    marginBottom: 30,
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
    marginVertical: 2,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
});
