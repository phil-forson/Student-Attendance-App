import { useState, useEffect } from "react";
import {
  DocumentData,
  Unsubscribe,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { IClass } from "../types";


const useClass = (classId: string) => {
  const [classData, setClassData] = useState<IClass | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe; // Define a variable to store the unsubscribe function

    const fetchClassData = async () => {
      try {
        const classDocRef = doc(db, "classes", classId);

        unsubscribe = onSnapshot(classDocRef, (doc) => {
          const classData = doc.data() as IClass;
          console.log(classData);
          setClassData(classData);
        });
      } catch (error) {
        console.error("Error fetching class data:", error);
        setClassData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [classId]);

  return {
    isLoading,
    classData,
  };
};

export default useClass;
