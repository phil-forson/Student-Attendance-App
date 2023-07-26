import { DocumentSnapshot, QuerySnapshot, addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import React from "react";
import { IAttendance, IClass } from "../types";

const fetchCourseData = async (courseId: string) => {
  const courseDoc = doc(db, "courses", courseId);
  const courseSnapshot = await getDoc(courseDoc);
  return courseSnapshot.data();
};

const fetchClassData = async (classId: string) => {
  const classDoc = doc(db, "classes", classId);
  const classSnapshot = await getDoc(classDoc);
  return classSnapshot.data();
};

export const getAllCoursesData = async (
  enrolledCourseIds: Array<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<any[]> => {
  setIsLoading(true);
  const enrolledCoursesPromises = enrolledCourseIds.map((courseId: string) =>
    fetchCourseData(courseId)
  );

  console.log("courses promises ", enrolledCoursesPromises);

  return Promise.all(enrolledCoursesPromises)
    .then((enrolledCourses: any) => {
      setIsLoading(false);
      console.log("enrolled courses in enrolled courses ", enrolledCourses);
      return enrolledCourses;
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      throw new Error("Error obtaining enrolled courses");
    });
};

export const getAllClassesData = async (
  enrolledClassIds: Array<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<IClass[]> => {
  setIsLoading(true);
  const enrolledClassesPromises = enrolledClassIds.map((classId: string) =>
    fetchClassData(classId)
  );

  return Promise.all(enrolledClassesPromises)
    .then((enrolledClasses: any) => {
      setIsLoading(false);
      console.log("enrolled courses in enrolled courses ", enrolledClasses);
      return enrolledClasses;
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      throw new Error("Error obtaining enrolled courses");
    });
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    enrolledCourses: arrayUnion(courseId),
  });

  const courseDocRef = doc(db, "courses", courseId);
  await updateDoc(courseDocRef, {
    enrolledStudents: arrayUnion(userId),
  });
};

export const joinCourse = (userId: string, courseCode: string): Promise<{ success: boolean; message: string }> => {
  return new Promise(async (resolve) => {
    try {
      // Find the course with the given course code

      const coursesQuery = query(collection(db, "courses"), where("courseCode", "==", courseCode));
      const coursesSnapshot = await getDocs(coursesQuery);

      console.log('no course found ', coursesSnapshot.empty)

      // Check if a matching course is found
      if (!coursesSnapshot.empty) {
        const courseDoc = coursesSnapshot.docs[0];
        const courseId = courseDoc.id;

        // Check if the user is already enrolled in the course
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const enrolledCourses = userDoc.data()?.enrolledCourses || [];
          if (!enrolledCourses.includes(courseId)) {
            // If the user is not enrolled, enroll them in the course
            await enrollUserInCourse(userId, courseId);
            resolve({ success: true, message: "Successfully joined the course!" });
          } else {
            resolve({ success: false, message: "You are already enrolled in this course!" });
          }
        }
      }

      resolve({ success: false, message: "Course not found with the given code!" });
    } catch (error) {
      console.error("Error joining course:", error);
      resolve({ success: false, message: "An error occurred while joining the course!" });
    }
  });
}

export const createClassInCourse = async (courseId: string, classData: IClass) => {
  const courseDocRef = doc(db, "courses", courseId);
  const classDocRef = await addDoc(collection(db, "classes"), classData);

  // Update the classes array in the course document
  const courseDoc = await getDoc(courseDocRef);
  if (courseDoc.exists()) {
    const courseClasses: Array<string> = courseDoc.data()?.courseClasses || [];
    courseClasses.push(classDocRef.id);
    await setDoc(courseDocRef, { courseClasses }, { merge: true });
  }

  // Fetch the list of enrolled users in the course
  const courseQuery = query(collection(db, "users"), where("enrolledCourses", "array-contains", courseId));
  const courseUsersSnapshot: QuerySnapshot = await getDocs(courseQuery);

  // Create attendance entries for each enrolled user
  courseUsersSnapshot.forEach(async (userDoc: DocumentSnapshot) => {
    const attendanceData: IAttendance = {
      clockIn: null,
      clockOut: null
    };
    const attendanceDocRef = doc(db, "classes", classDocRef.id, "attendance", userDoc.id);
    await setDoc(attendanceDocRef, attendanceData);
  });
};
export const isCourseCodeUnique = async(courseCode: string): Promise<boolean> => {
  const coursesRef = collection(db, "courses");

  // Use the 'where' clause to filter courses with the given course code
  const querySnapshot = await getDocs(query(coursesRef, where("courseCode", "==", courseCode)));

  console.log(querySnapshot)

  console.log('is course code unique ', querySnapshot.empty)

  const isCodeUnique = querySnapshot.empty

  // If the query returns any documents, the course code is not unique
  return isCodeUnique;
}
