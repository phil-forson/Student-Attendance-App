import { useState, useEffect } from "react";
import {
  DocumentData,
  Unsubscribe,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ICourseDetails } from "../types";

const useCourse = (courseId: string) => {
  const [courseData, setCourseData] = useState<ICourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe; // Define a variable to store the unsubscribe function

    const fetchCourseData = async () => {
      try {
        const courseDocRef = doc(db, "courses", courseId);
        const courseSnapshot = await getDoc(courseDocRef);

        unsubscribe = onSnapshot(courseDocRef, (doc) => {
          const courseData = doc.data() as ICourseDetails;
          console.log(courseData);
          setCourseData(courseData);
        });
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [courseId]);

  return {
    isLoading,
    courseData,
  };
};

export default useCourse;
