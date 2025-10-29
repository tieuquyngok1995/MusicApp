import { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';

export default function GreetingSection({ videoUri, lyrics }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0); // tỉ lệ 0-1
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.stop(); // hoặc unload
      }
    };
  }, []);

  const onProgress = data => {
    setProgress(data.currentTime / duration);
  };

  const onLoad = data => {
    setDuration(data.duration);
  };

  const togglePlay = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      {/* Lyrics Section */}
      <View style={styles.lyricsContainer}>
        <Text style={styles.lyricsText}>{lyrics}</Text>
      </View>

      {/* Video Controls */}
      <View style={styles.controlsContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          paused={paused}
          onProgress={onProgress}
          onLoad={onLoad}
          style={{ height: 0, width: 0 }} // ẩn video nếu không muốn hiển thị
        />
        <Slider
          style={styles.slider}
          value={progress}
          minimumValue={0}
          maximumValue={1}
          onSlidingComplete={value => {
            const seekTime = value * duration;
            videoRef.current.seek(seekTime);
            setProgress(value);
          }}
        />
        <Button title={paused ? 'Play' : 'Pause'} onPress={togglePlay} />
      </View>
    </View>
  );
}

GreetingSection.propTypes = {
  videoUri: PropTypes.string.isRequired,
  lyrics: PropTypes.arrayOf(PropTypes.string),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  lyricsContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricsText: {
    fontSize: 20,
    textAlign: 'center',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
