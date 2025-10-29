import { Audios } from '@constants';
import NoteIcon from '@assets/icons/note-crotchet.png';
import BaseRhythm from '@components/BaseRhythm';

export default function ExercisesRhythms() {
  // ví dụ notes (thời điểm tính bằng giây từ đầu)
  const notes = [
    { id: 'n1', time: 0.5, label: '1', soundIndex: 0 },
    { id: 'n2', time: 1.0, label: 'e', soundIndex: 0 },
    { id: 'n3', time: 1.5, label: '&', soundIndex: 0 },
    { id: 'n4', time: 2.0, label: 'a', soundIndex: 0 },
    { id: 'n5', time: 3.0, label: '1', soundIndex: 0 },
    { id: 'n6', time: 4.25, label: '2', soundIndex: 0 },
    { id: 'n7', time: 6.5, label: '3', soundIndex: 0 },
  ];

  // preload âm thanh (thay bằng file của bạn trong /assets)
  const noteSounds = [Audios.NOTE];

  const customStyle = {
    container: { backgroundColor: '#f9f9f9' },
    marker: { width: 40 },
    noteIcon: { width: 30, height: 30 },
    progressFill: { backgroundColor: '#ff5722' },
  };

  return (
    <BaseRhythm
      notes={notes}
      noteSounds={noteSounds}
      noteIcon={NoteIcon}
      styleOverrides={customStyle}
    />
  );
}
