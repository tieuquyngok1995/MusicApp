import { Colors, Audios } from '@constants';
import { ExerciseWriteNotes } from '@components/BaseColorCoding';

export default function ExercisesColorCoding() {
  const initialButtons = [
    {
      id: 'b1',
      color: Colors.C,
      audioFile: Audios.C,
      position: { top: 200, left: 100 },
    },
    {
      id: 'b2',
      color: Colors.D,
      audioFile: Audios.D,
      position: { top: 200, left: 250 },
    },
    {
      id: 'b3',
      color: Colors.E,
      audioFile: Audios.E,
      position: { top: 200, left: 400 },
    },
    {
      id: 'b4',
      color: Colors.F,
      audioFile: Audios.F,
      position: { top: 200, left: 550 },
    },
    {
      id: 'b5',
      color: Colors.G,
      audioFile: Audios.G,
      position: { top: 200, left: 700 },
    },
    {
      id: 'b6',
      color: Colors.A,
      audioFile: Audios.A,
      position: { top: 200, left: 850 },
    },
    {
      id: 'b7',
      color: Colors.B,
      audioFile: Audios.B,
      position: { top: 200, left: 1000 },
    },
  ];

  return <ExerciseWriteNotes initialButtons={initialButtons} />;
}
