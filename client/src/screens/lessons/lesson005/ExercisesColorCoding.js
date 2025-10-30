import { Colors, Audios } from '@constants';
import { ExerciseColorNotes } from '@components/BaseColorCoding';

export default function ExercisesColorCoding() {
  const initialButtons = [
    {
      id: 'b1',
      color: Colors.C,
      audioFile: Audios.C,
      position: { top: 500, left: 100 },
    },
    {
      id: 'b2',
      color: Colors.D,
      audioFile: Audios.D,
      position: { top: 500, left: 250 },
    },
    {
      id: 'b3',
      color: Colors.E,
      audioFile: Audios.E,
      position: { top: 500, left: 400 },
    },
    {
      id: 'b4',
      color: Colors.F,
      audioFile: Audios.F,
      position: { top: 500, left: 550 },
    },
    {
      id: 'b5',
      color: Colors.G,
      audioFile: Audios.G,
      position: { top: 500, left: 700 },
    },
    {
      id: 'b6',
      color: Colors.A,
      audioFile: Audios.A,
      position: { top: 500, left: 850 },
    },
    {
      id: 'b7',
      color: Colors.B,
      audioFile: Audios.B,
      position: { top: 500, left: 1000 },
    },
  ];

  const dropPositions = [
    { text: 'A', position: { top: 150, left: 100 } },
    { text: 'B', position: { top: 150, left: 250 } },
    { text: 'C', position: { top: 150, left: 400 } },
    { text: 'D', position: { top: 150, left: 550 } },
    { text: 'E', position: { top: 150, left: 700 } },
    { text: 'F', position: { top: 150, left: 850 } },
    { text: 'G', position: { top: 150, left: 1000 } },
  ];

  return (
    <ExerciseColorNotes
      dropPositions={dropPositions}
      initialButtons={initialButtons}
    />
  );
}
