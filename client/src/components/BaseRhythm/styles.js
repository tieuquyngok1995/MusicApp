import { StyleSheet, Dimensions } from 'react-native';
export const { width } = Dimensions.get('window');
export const PROGRESS_BAR_PADDING = 20;
export const PROGRESS_WIDTH = width - PROGRESS_BAR_PADDING * 2;

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  progressOuter: {
    height: 480,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressTrack: {
    position: 'absolute',
    left: PROGRESS_BAR_PADDING,
    right: PROGRESS_BAR_PADDING,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  progressFill: {
    position: 'absolute',
    left: PROGRESS_BAR_PADDING,
    height: 6,
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  markersContainer: {
    position: 'absolute',
    left: PROGRESS_BAR_PADDING,
    right: PROGRESS_BAR_PADDING,
    height: 120,
  },
  marker: { position: 'absolute', top: 10, alignItems: 'center', width: 30 },
  noteIcon: { width: 40, height: 40, marginTop: -60 },
  playHead: {
    position: 'absolute',
    top: 110,
    width: 4,
    height: 120,
    backgroundColor: '#902C2F',
    borderRadius: 4,
  },
  controls: { flexDirection: 'row', marginTop: 12 },
  btn: {
    padding: 12,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    marginRight: 8,
  },
  btnFixed: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAlt: { backgroundColor: '#9e9e9e' },
  btnText: { color: '#fff', fontWeight: '600' },
  chip: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginRight: 8,
  },
});
