import { loadLazyModule } from '@utils/LazyLoader';

export const CommonSections = {
  Singing: loadLazyModule(() => import('@components/sections/Greeting')),
  Goodbye: loadLazyModule(() => import('@components/sections/Singing')),
  Greeting: loadLazyModule(() => import('@components/sections/Goodbye')),
};

export const LessonRegistry = {
  lesson001: {
    ...CommonSections,
    StoryTime: loadLazyModule(
      () => import('@lesson/lesson001/StoryTime'),
      'StoryTime',
    ),
    ColorCoding: loadLazyModule(
      () => import('@lesson/lesson001/ColorCoding'),
      'ColorCoding',
    ),
  },
  lesson002: {
    ...CommonSections,
    ColorIdentifying: loadLazyModule(
      () => import('@lesson/lesson002/ColorIdentifying'),
      'ColorIdentifying',
    ),
    Rhythms: loadLazyModule(
      () => import('@lesson/lesson002/Rhythms'),
      'Rhythms',
    ),
  },
};
