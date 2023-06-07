import React, { ReactNode, useState } from "react";
import { ClassContext } from "../contexts/ClassContext";

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [courseClass, setCourseClass] = useState({});
  const [courseClasses, setCourseClasses] = useState<any>([]);


  const setCourseClassData = (data: any) => {
    setCourseClass(data);
  };

  const setCourseClassesData = (data: any) => {
    setCourseClasses(data);
  };

  return (
    <ClassContext.Provider
      value={{
        courseClass,
        setCourseClassData,
        courseClasses,
        setCourseClassesData,

      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
