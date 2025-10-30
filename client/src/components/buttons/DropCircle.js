import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Animated from 'react-native-reanimated';

const DropCircle = React.forwardRef(({ style }, ref) => {
  return <Animated.View ref={ref} style={[styles.dropCircle, style]} />;
});

DropCircle.displayName = 'DropCircle';

DropCircle.propTypes = {
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  dropCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default DropCircle;
