import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const DotLabel = ({ text, style, textStyle }) => {
  return (
    <View style={[styles.labelBubble, style]}>
      <Text style={[styles.labelText, textStyle]}>{text}</Text>
    </View>
  );
};

DotLabel.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  labelBubble: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1.5,
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  labelText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 32,
    color: '#000',
  },
});

export default DotLabel;
