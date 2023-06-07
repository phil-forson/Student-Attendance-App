import { CourseContext } from "../contexts/CourseContext";
import React, { ReactNode, useState } from "react";

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState<any>([]);
  const [enrolledMembers, setEnrolledMembers] = useState<any>([]);
  const [courseId, setCourseId] = useState('')

  const setCourseData = (data: any) => {
    setCourse(data);
  };

  const setEnrolledCoursesData = (data: any) => {
    setEnrolledCourses(data);
  };

  const setEnrolledMembersData = (data: any) => {
    setEnrolledMembers(data);
  };

  return (
    <CourseContext.Provider
      value={{
        course,
        setCourseData,
        enrolledCourses,
        setEnrolledCoursesData,
        enrolledMembers,
        setEnrolledMembersData,
        courseId,
        setCourseId
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
