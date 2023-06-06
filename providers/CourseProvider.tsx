import { CourseContext } from "../contexts/CourseContext";
import React, { ReactNode, useState } from "react";

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState({});

  const setCourseData = (data: any) => {
    setCourse(data);
  };

  return (
    <CourseContext.Provider value={{ course, setCourseData }}>
      {children}
    </CourseContext.Provider>
  );
};
