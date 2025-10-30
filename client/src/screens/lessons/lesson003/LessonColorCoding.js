import { Colors, Audios } from '@constants';
import { BaseColorCoding } from '@components/BaseColorCoding';

export default function ColorCoding() {
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
    { top: 300, left: 50 },
    { top: 300, left: 150 },
    { top: 300, left: 250 },
    { top: 300, left: 350 },
    { top: 200, left: 400 },
    { top: 200, left: 500 },
    { top: 200, left: 600 },
    { top: 200, left: 700 },
    { top: 300, left: 750 },
    { top: 300, left: 850 },
    { top: 200, left: 900 },
    { top: 200, left: 1000 },
    { top: 300, left: 1050 },
  ];

  return (
    <BaseColorCoding
      dropPositions={dropPositions}
      initialButtons={initialButtons}
    />
  );
}
