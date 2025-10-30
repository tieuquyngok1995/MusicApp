import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  dropsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  circlePosition: { position: 'absolute' },
  dropCirclePosition: {
    position: 'absolute',
  },
  buttonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  svg: { position: 'absolute', top: 0, left: 0 },
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

  writeNotesButton: {
    position: 'absolute',
  },
  writeNotesInput: {
    top: 120,
    left: 15,
    position: 'absolute',
    height: 60,
    width: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    color: '#000000',
    fontSize: 32,
    textAlign: 'center',
  },

  colorNotesLabel: {
    marginTop: 120,
    marginLeft: 15,
    position: 'absolute',
  },
});
