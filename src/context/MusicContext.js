import React, { createContext, useState } from 'react';

export const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playLesson = lesson => {
    setCurrentLesson(lesson);
    setIsPlaying(true);
  };

  const pauseLesson = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{ currentLesson, isPlaying, playLesson, pauseLesson }}
    >
      {children}
    </MusicContext.Provider>
  );
}
