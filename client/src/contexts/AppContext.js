import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Tạo context
const AppContext = createContext();

// 2. Provider
export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(null); // teacher / student
  const [lessons, setLessons] = useState([]); // danh sách bài học
  const [user, setUser] = useState(null); // thông tin user
  const [settings, setSettings] = useState({}); // các config khác

  // Ví dụ thêm các hàm helper
  const resetApp = () => {
    setRole(null);
    setLessons([]);
    setUser(null);
    setSettings({});
  };

  const updateLesson = (lessonId, data) => {
    setLessons(prev =>
      prev.map(l => (l.id === lessonId ? { ...l, ...data } : l)),
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        lessons,
        setLessons,
        user,
        setUser,
        settings,
        setSettings,
        resetApp,
        updateLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 3. Custom hook tiện lợi
export const useAppContext = () => useContext(AppContext);
