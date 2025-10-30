import { Colors, Audios } from '@constants';
import { ExerciseMatchColors } from '@components/BaseColorCoding';

export default function ExercisesColorCoding() {
  const dotsA = [
    {
      id: 'A1',
      x: 125,
      y: 220,
      group: 'A',
      color: Colors.C,
      audioFile: Audios.C,
    },
    {
      id: 'A2',
      x: 325,
      y: 220,
      group: 'A',
      color: Colors.D,
      audioFile: Audios.D,
    },
    {
      id: 'A3',
      x: 525,
      y: 220,
      group: 'A',
      color: Colors.E,
      audioFile: Audios.E,
    },
    {
      id: 'A4',
      x: 725,
      y: 220,
      group: 'A',
      color: Colors.C,
      audioFile: Audios.C,
    },
    {
      id: 'A5',
      x: 925,
      y: 220,
      group: 'A',
      color: Colors.A,
      audioFile: Audios.A,
    },
    {
      id: 'A6',
      x: 1125,
      y: 220,
      group: 'A',
      color: Colors.B,
      audioFile: Audios.B,
    },
  ];

  const dotsB = [
    { id: 'B1', x: 125, y: 450, group: 'B', text: 'C' },
    { id: 'B2', x: 325, y: 450, group: 'B', text: 'A' },
    { id: 'B3', x: 525, y: 450, group: 'B', text: 'C' },
    { id: 'B4', x: 725, y: 450, group: 'B', text: 'D' },
    { id: 'B5', x: 925, y: 450, group: 'B', text: 'E' },
    { id: 'B6', x: 1125, y: 450, group: 'B', text: 'B' },
  ];

  return (
    <ExerciseMatchColors
      dotsA={dotsA}
      dotsB={dotsB}
      styleOverrides={{ backgroundColor: '#f0f0f0' }}
    />
  );
}
