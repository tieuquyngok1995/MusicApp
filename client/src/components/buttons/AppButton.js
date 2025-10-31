import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AppButton({
  title,
  onPress,
  mode = 'primary', // default mode
  disabled = false,
  style,
  textStyle,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        modeStyles[mode],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textColor[mode], textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

AppButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['primary', 'secondary', 'success']),
  disabled: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const modeStyles = {
  primary: {
    backgroundColor: '#007BFF',
  },
  secondary: {
    backgroundColor: '#6C757D',
  },
  danger: {
    backgroundColor: '#DC3545',
  },
};

const textColor = {
  primary: { color: '#FFFFFF' },
  secondary: { color: '#FFFFFF' },
  danger: { color: '#FFFFFF' },
};
