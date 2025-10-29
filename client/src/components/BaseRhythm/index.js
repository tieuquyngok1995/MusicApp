import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';
import DefaultNoteIcon from '@assets/icons/note-crotchet.png';
import {
  styles as defaultStyles,
  PROGRESS_WIDTH,
  PROGRESS_BAR_PADDING,
} from './styles';

export default function BaseRhythm({
  duration = 8,
  tempo: initialTempo = 1,
  notes = [],
  noteSounds = [],
  noteIcon = DefaultNoteIcon,
  styleOverrides = {},
}) {
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [tempo, setTempo] = useState(initialTempo);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundsRef = useRef([]);
  const progress = useRef(new Animated.Value(0)).current;
  const startTsRef = useRef(null);
  const pausedAtRef = useRef(0);
  const playedNotesRef = useRef(new Set());
  const rafRef = useRef(null);

  // preload sound
  useEffect(() => {
    noteSounds.forEach((src, i) => {
      const s = new Sound(src, Sound.MAIN_BUNDLE, error => {
        if (!error) soundsRef.current[i] = s;
      });
    });
    return () => soundsRef.current.forEach(s => s?.release());
  }, [noteSounds]);

  const playSound = index => {
    const s = soundsRef.current[index];
    if (!s) return;
    s.stop(() =>
      s.play(success => !success && console.log('Sound playback failed')),
    );
  };

  const tick = () => {
    if (!startTsRef.current) return;
    const now = Date.now();
    const totalScaledTime =
      (pausedAtRef.current + (now - startTsRef.current) / 1000) * tempo;

    progress.setValue(Math.min(totalScaledTime / duration, 1));

    for (const n of notes) {
      if (!playedNotesRef.current.has(n.id) && totalScaledTime >= n.time) {
        playedNotesRef.current.add(n.id);
        setActiveNoteId(n.id);
        playSound(n.soundIndex ?? 0);
        setTimeout(() => setActiveNoteId(null), 200);
      }
    }

    if (totalScaledTime < duration) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setIsPlaying(false);
      pausedAtRef.current = 0;
      startTsRef.current = null;
      playedNotesRef.current.clear();
      progress.setValue(0);
    }
  };

  const onPlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    startTsRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
  };

  const onPause = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    if (startTsRef.current)
      pausedAtRef.current += (Date.now() - startTsRef.current) / 1000;
    startTsRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  const onForward = () => {
    let newTime = pausedAtRef.current;
    if (startTsRef.current && isPlaying) {
      newTime += (Date.now() - startTsRef.current) / 1000;
    }
    newTime = Math.min(newTime + 1, duration);
    pausedAtRef.current = newTime;
    startTsRef.current = isPlaying ? Date.now() : null;

    progress.setValue(newTime / duration);

    if (!isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }

    playedNotesRef.current = new Set(
      notes.filter(n => n.time < newTime).map(n => n.id),
    );
  };

  const onRewind = () => {
    let newTime = pausedAtRef.current;
    if (startTsRef.current && isPlaying) {
      newTime += (Date.now() - startTsRef.current) / 1000;
    }
    newTime = Math.max(newTime - 1, 0);
    pausedAtRef.current = newTime;
    startTsRef.current = isPlaying ? Date.now() : null;

    progress.setValue(newTime / duration);

    playedNotesRef.current = new Set(
      notes.filter(n => n.time < newTime).map(n => n.id),
    );

    if (!isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const onReset = () => {
    setIsPlaying(false);
    startTsRef.current = null;
    pausedAtRef.current = 0;
    playedNotesRef.current.clear();
    progress.setValue(0);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  const renderMarkers = () =>
    notes.map(n => {
      const left = (n.time / duration) * PROGRESS_WIDTH;
      return (
        <View
          key={n.id}
          style={[
            defaultStyles.marker,
            styleOverrides.marker,
            { left, transform: [{ translateX: -15 }] },
          ]}
        >
          <Image
            source={noteIcon}
            style={[
              defaultStyles.noteIcon,
              styleOverrides.noteIcon,
              { tintColor: activeNoteId === n.id ? '#4caf50' : '#000' },
            ]}
          />
        </View>
      );
    });

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_WIDTH],
  });

  return (
    <View style={[defaultStyles.container, styleOverrides.container]}>
      <View style={defaultStyles.progressOuter}>
        <View
          style={[defaultStyles.progressTrack, styleOverrides.progressTrack]}
        />
        <View style={defaultStyles.markersContainer}>{renderMarkers()}</View>
        <Animated.View
          style={[
            defaultStyles.progressFill,
            styleOverrides.progressFill,
            { width: progressBarWidth },
          ]}
        />
        <Animated.View
          style={[
            defaultStyles.playHead,
            styleOverrides.playHead,
            {
              left: Animated.add(
                progressBarWidth,
                new Animated.Value(PROGRESS_BAR_PADDING - 6),
              ),
              transform: [{ translateX: -6 }],
            },
          ]}
        />
      </View>

      <View style={defaultStyles.controls}>
        <TouchableOpacity style={defaultStyles.btn} onPress={onRewind}>
          <Text style={defaultStyles.btnText}>{'<< 1s'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[defaultStyles.btn, defaultStyles.btnFixed]}
          onPress={isPlaying ? onPause : onPlay}
        >
          <Text style={defaultStyles.btnText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={defaultStyles.btn} onPress={onForward}>
          <Text style={defaultStyles.btnText}>{'1s >>'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[defaultStyles.btn, defaultStyles.btnAlt]}
          onPress={onReset}
        >
          <Text style={defaultStyles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text>Tempo: {tempo.toFixed(2)}x</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {[0.75, 1, 1.5, 2].map(t => (
            <TouchableOpacity
              key={t}
              style={defaultStyles.chip}
              onPress={() => setTempo(t)}
            >
              <Text>{t}x</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

BaseRhythm.propTypes = {
  duration: PropTypes.number,
  tempo: PropTypes.number,
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      time: PropTypes.number.isRequired,
      soundIndex: PropTypes.number,
    }),
  ),
  noteSounds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  noteIcon: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ uri: PropTypes.string }),
  ]),
  styleOverrides: PropTypes.object,
};
