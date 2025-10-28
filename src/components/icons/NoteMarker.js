// NoteMarker.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function NoteMarker({ active, position, icon }) {
  return (
    <View style={[styles.container, { left: position }]}>
      <View
        style={[
          styles.markerDot,
          { backgroundColor: active ? '#4caf50' : '#000' },
        ]}
      />
      <Image
        source={icon}
        style={[styles.noteIcon, { tintColor: active ? '#4caf50' : '#000' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    width: 30,
    transform: [{ translateX: -15 }],
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  noteIcon: {
    width: 20,
    height: 20,
    marginTop: 4,
  },
});
