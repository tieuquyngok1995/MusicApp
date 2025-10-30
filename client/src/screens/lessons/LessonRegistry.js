import { loadLazyModule } from '@utils/lazyLoader';

export const CommonSections = {
  Greeting: loadLazyModule(
    () => import('@screens/sections/Greeting'),
    'Greeting',
  ),
  Singing: loadLazyModule(() => import('@screens/sections/Singing'), 'Singing'),
  Goodbye: loadLazyModule(() => import('@screens/sections/Goodbye'), 'Goodbye'),
};

export const LessonRegistry = {
  lesson001: {
    ...CommonSections,
    StoryTime: loadLazyModule(
      () => import('@lessons/lesson001/StoryTime'),
      'lesson001-StoryTime',
    ),
    LessonColorCoding: loadLazyModule(
      () => import('@lessons/lesson001/LessonColorCoding'),
      'lesson001-LessonColorCoding',
    ),
    ExercisesColorCoding: loadLazyModule(
      () => import('@lessons/lesson001/ExercisesColorCoding'),
      'lesson001-ExercisesColorCoding',
    ),
  },
  lesson002: {
    ...CommonSections,
    ColorIdentifying: loadLazyModule(
      () => import('@lessons/lesson002/ColorIdentifying'),
      'lesson002-ColorIdentifying',
    ),
    LessonRhythms: loadLazyModule(
      () => import('@lessons/lesson002/LessonRhythms'),
      'lesson002-LessonRhythms',
    ),
    ExercisesRhythms: loadLazyModule(
      () => import('@lessons/lesson002/ExercisesRhythms'),
      'lesson002-ExercisesRhythms',
    ),
  },
  lesson003: {
    ...CommonSections,
    StoryTime: loadLazyModule(
      () => import('@lessons/lesson003/StoryTime'),
      'lesson003-StoryTime',
    ),
    LessonColorCoding: loadLazyModule(
      () => import('@lessons/lesson003/LessonColorCoding'),
      'lesson003-LessonColorCoding',
    ),
    ExercisesColorCoding: loadLazyModule(
      () => import('@lessons/lesson003/ExercisesColorCoding'),
      'lesson003-ExercisesColorCoding',
    ),
  },
  lesson005: {
    ...CommonSections,
    StoryTime: loadLazyModule(
      () => import('@lessons/lesson005/StoryTime'),
      'lesson005-StoryTime',
    ),
    LessonColorCoding: loadLazyModule(
      () => import('@lessons/lesson005/LessonColorCoding'),
      'lesson005-LessonColorCoding',
    ),
    ExercisesColorCoding: loadLazyModule(
      () => import('@lessons/lesson005/ExercisesColorCoding'),
      'lesson005-ExercisesColorCoding',
    ),
  },
};
