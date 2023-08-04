import {
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import React from "react";
import { IAttendance, IClass } from "../types";
import useClass from "../hooks/useClass";
import {
  convertToDayString,
  getCurrentLocaleDateString,
  getValueFor,
  save,
} from "./utils";

const fetchCourseData = async (courseId: string) => {
  const courseDoc = doc(db, "courses", courseId);
  const courseSnapshot = await getDoc(courseDoc);
  return courseSnapshot.data();
};

const fetchClassData = async (classId: string): Promise<IClass> => {
  const classDocRef = doc(db, "classes", classId);
  const classSnapshot = await getDoc(classDocRef);

  return classSnapshot.data() as IClass;
};

export const getAllCoursesData = async (
  enrolledCourseIds: Array<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<any[]> => {
  setIsLoading(true);
  const enrolledCoursesPromises = enrolledCourseIds.map((courseId: string) =>
    fetchCourseData(courseId)
  );

  return Promise.all(enrolledCoursesPromises)
    .then((enrolledCourses: any) => {
      setIsLoading(false);
      return enrolledCourses;
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      throw new Error("Error obtaining enrolled courses");
    });
};

export const getAllClassesData = async (
  enrolledClassIds: Array<string>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{ enrolledClasses: IClass[] }> => {
  setIsLoading(true);

  const enrolledClassesPromises = enrolledClassIds.map(
    async (classId: string) => {
      return await fetchClassData(classId);
    }
  );

  const enrolledClasses: IClass[] = await Promise.all(enrolledClassesPromises);

  setIsLoading(false);

  return { enrolledClasses };
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

export const joinCourse = (
  userId: string,
  courseCode: string
): Promise<{ success: boolean; message: string }> => {
  return new Promise(async (resolve) => {
    try {
      // Find the course with the given course code

      const coursesQuery = query(
        collection(db, "courses"),
        where("courseCode", "==", courseCode)
      );
      const coursesSnapshot = await getDocs(coursesQuery);

      console.log("no course found ", coursesSnapshot.empty);

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
            resolve({
              success: true,
              message: "Successfully joined the course!",
            });
          } else {
            resolve({
              success: false,
              message: "You are already enrolled in this course!",
            });
          }
        }
      }

      resolve({
        success: false,
        message: "Course not found with the given code!",
      });
    } catch (error) {
      console.error("Error joining course:", error);
      resolve({
        success: false,
        message: "An error occurred while joining the course!",
      });
    }
  });
};

export const createClassInCourse = async (
  courseId: string,
  classData: IClass
) => {
  const courseDocRef = doc(db, "courses", courseId);
  await setDoc(doc(db, "classes", classData.uid), classData);

  // Update the classes array in the course document
  const courseDoc = await getDoc(courseDocRef);
  if (courseDoc.exists()) {
    const courseClasses: Array<string> = courseDoc.data()?.courseClasses || [];
    courseClasses.push(classData.uid);
    await setDoc(courseDocRef, { courseClasses }, { merge: true });
  }

  // Fetch the list of enrolled users in the course
  const courseQuery = query(
    collection(db, "users"),
    where("enrolledCourses", "array-contains", courseId)
  );
  const courseUsersSnapshot: QuerySnapshot = await getDocs(courseQuery);

  // Create attendance entries for each enrolled user
  courseUsersSnapshot.forEach(async (userDoc: DocumentSnapshot) => {
    const attendanceData: IAttendance = {
      clockIn: null,
      clockOut: null,
    };
    const attendanceDocRef = doc(
      db,
      "classes",
      classData.uid,
      "attendance",
      userDoc.id
    );
    await setDoc(attendanceDocRef, attendanceData);
  });
};

export const removeClassFromCourse = async (
  classId: string,
  courseId: string
) => {
  try {
    // Get the course document
    const courseDocRef = doc(db, "courses", courseId);
    const courseDoc = await getDoc(courseDocRef);

    // Check if the course document exists
    if (courseDoc.exists()) {
      // Get the classes array from the course document
      const classes = courseDoc.data()?.courseClasses || [];

      console.log("class id", classId);

      console.log("classes ", classes);

      // Find the index of the class in the classes array
      const classIndex = classes.indexOf(classId);

      console.log("class index ", classIndex);

      // If the class is found in the array, remove it
      if (classIndex !== -1) {
        classes.splice(classIndex, 1);

        // Update the course document with the updated classes array
        await updateDoc(courseDocRef, { courseClasses: arrayRemove(classId) });

        return { success: true, message: "Class removed from the course!" };
      } else {
        return { success: false, message: "Class not found in the course!" };
      }
    } else {
      return { success: false, message: "Course not found!" };
    }
  } catch (error) {
    console.error("Error removing class from course:", error);
    return {
      success: false,
      message: "An error occurred while removing the class from the course!",
    };
  }
};

export async function updateClassDetails(
  classId: string,
  classData: IClass
): Promise<void> {
  try {
    const classDocRef = doc(db, "classes", classId);
    await updateDoc(classDocRef, classData as any);
    console.log("Class details updated successfully!");
  } catch (error) {
    console.error("Error updating class details:", error);
    throw error;
  }
}

export const userClockIn = async (userId: string, classId: string) => {
  try {
    const currentTime = new Date(Date.now()).toISOString();
    console.log("current time ", currentTime);
    await save("clockIn", currentTime);
    const dateString = await getValueFor("clockIn");
    console.log('today"s string ', dateString);
    const clockInDate = new Date(dateString ?? Date.now());
    const attendanceData = {
      clockIn: clockInDate, // Assuming you have imported Timestamp from firebase/firestore
      clockOut: null,
    };

    // Save the clock in time in the attendance document
    await setDoc(
      doc(db, "classes", classId, "attendance", userId),
      attendanceData,
      { merge: true }
    );

    await setDoc(
      doc(db, "users", userId),
      { clockedIn: true, classClockedIn: classId, clockInDate: clockInDate },
      { merge: true }
    );
    console.log("Clocked in successfully!");
  } catch (error) {
    console.error("Error clocking in:", error);
  }
};

export const userClockOut = async (userId: string, classId: string, endTime?: Date) => {
  try {
    // Fetch the existing attendance data
    const attendanceDoc = await getDoc(
      doc(db, "classes", classId, "attendance", userId)
    );
    const attendanceData = attendanceDoc.data();

    // If there is no existing attendance data, do not proceed with clocking out
    if (!attendanceData) {
      console.error("No attendance data found for this user and class!");
      return;
    }

    // Check if the user is already clocked out
    if (attendanceData.clockOut) {
      console.log("You are already clocked out for this class.");
      return;
    }

    // Save the clock out time in the attendance document
    
    await setDoc(
      doc(db, "classes", classId, "attendance", userId),
      { clockOut: endTime ?? Timestamp.now() },
      { merge: true }
    );

    await setDoc(
      doc(db, "users", userId),
      { clockedIn: false, classClockedIn: null },
      { merge: true }
    );
    console.log("Clocked out successfully!");
  } catch (error) {
    console.error("Error clocking out:", error);
  }
};

export async function isUserClockedInAndNotClockedOut(
  classId: string,
  userId: string
) {
  try {
    // Get the class document from Firebase
    const attendanceDoc = await getDoc(
      doc(db, "classes", classId, "attendance", userId)
    );
    const attendanceData = attendanceDoc.data();

    console.log("attendance data ", attendanceData);

    if (attendanceData?.clockIn && !attendanceData?.clockOut) {
      return true;
    }


    // If class or attendance data for the user is not found, return false
    return false;
  } catch (error) {
    console.error("Error checking user's clock-in status:", error);
    return false;
  }
}

export const isCourseCodeUnique = async (
  courseCode: string
): Promise<boolean> => {
  const coursesRef = collection(db, "courses");

  // Use the 'where' clause to filter courses with the given course code
  const querySnapshot = await getDocs(
    query(coursesRef, where("courseCode", "==", courseCode))
  );

  console.log(querySnapshot);

  console.log("is course code unique ", querySnapshot.empty);

  const isCodeUnique = querySnapshot.empty;

  // If the query returns any documents, the course code is not unique
  return isCodeUnique;
};
