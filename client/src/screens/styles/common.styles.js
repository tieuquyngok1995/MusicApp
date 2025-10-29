import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
