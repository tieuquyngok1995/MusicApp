import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

const SectionCard = ({ title, icon, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
      <View style={styles.textContainer}>
        <Text style={[styles.title, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});

export default SectionCard;
