import {
  DocumentData,
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
import { IAttendance, IClass, ICourse, UserData } from "../types";
import useClass from "../hooks/useClass";
import {
  calculateSecondsDifference,
  convertToDayString,
  getCurrentLocaleDateString,
  getValueFor,
  save,
} from "./utils";

export const getClassData = async (classId: string) => {
  console.log("class id===========", classId);
  const classDocRef = doc(db, "classes", classId);
  onSnapshot(classDocRef, (doc) => {
    const classData = doc.data() as IClass;
    console.log(
      "class data======================================== ",
      classData
    );
    return classData;
  });
};
export const fetchCourseData = async (courseId: string) => {
  const courseDoc = doc(db, "courses", courseId);
  const courseSnapshot = await getDoc(courseDoc);
  return courseSnapshot.data();
};

export const fetchClassData = async (classId: string): Promise<IClass> => {
  const classDocRef = doc(db, "classes", classId);
  const classSnapshot = await getDoc(classDocRef);

  return classSnapshot.data() as IClass;
};

export const getAllCoursesData = async (
  enrolledCourseIds: Array<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<ICourse[]> => {
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
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{ enrolledClasses: IClass[] }> => {
  if (setIsLoading) {
    setIsLoading(true);
  }
  try {
    const enrolledClassesPromises = enrolledClassIds?.map(
      async (classId: string) => {
        return await fetchClassData(classId);
      }
    );

    const enrolledClasses: IClass[] = await Promise.all(
      enrolledClassesPromises
    );

    return { enrolledClasses };
  } catch (error) {
    // Handle the error here
    console.error("Error in getAllClassesData:", error);
    throw error; // Re-throw the error to propagate it
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
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

export const userClockIn = async (
  userId: string,
  classId: string,
  firstName: string,
  lastName: string
) => {
  try {
    const currentTime = new Date(Date.now()).toISOString();
    await save("clockIn", currentTime);
    const dateString = await getValueFor("clockIn");
    const clockInDate = new Date(dateString ?? Date.now());
    const attendanceData = {
      clockIn: clockInDate,
      clockOut: null,
      firstName: firstName,
      lastName: lastName,
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

export const userClockOut = async (
  userId: string,
  classId: string,
  endTime?: Date
) => {
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

export const getUsersWithAttendanceData = async (
  enrolledStudentIds: string[],
  classId: string
) => {
  const userDataAndAttendance = [];

  try {
    const classDoc = await getDoc(doc(db, "classes", classId));
    const classData = classDoc.data();
    for (const enrolledStudentId of enrolledStudentIds) {
      const userDoc = await getDoc(doc(db, "users", enrolledStudentId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        //Get Class Data
        // Fetch attendance data for the student
        const attendanceDoc = await getDoc(
          doc(db, "classes", classId, "attendance", enrolledStudentId)
        );
        if (attendanceDoc.exists()) {
          const attendanceData = attendanceDoc.data();

          // Do something with userData and attendanceData
          userDataAndAttendance.push({
            userData,
            attendanceData,
            classData,
          });
        } else {
          const attendanceData = {
            clockIn: null,
            clockOut: null,
          };
          userDataAndAttendance.push({
            userData,
            attendanceData,
            classData,
          });
        }
      } else {
        console.log(`No user data found for student ${enrolledStudentId}`);
      }
    }

    console.log("user data and attendance ", userDataAndAttendance);
    return userDataAndAttendance;
  } catch (error) {
    console.error("Error fetching user data and attendance:", error);
    throw error;
  }
};

export const getUsersForCourseAttendanceData = async (
  enrolledStudentIds: string[],
  classIds: string[]
) => {
  const userDataAndAttendance: {
    userData: any; // Replace 'any' with the actual user data type
    attendanceData: Record<string, any>; // Replace 'any' with the actual attendance data type
  }[] = [];

  try {
    for (const enrolledStudentId of enrolledStudentIds) {
      const userDoc = await getDoc(doc(db, "users", enrolledStudentId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userAttendance = {
          userData,
          attendanceData: {} as Record<string, any>,
        };
        console.log("class ids ", classIds);

        for (const classId of classIds) {
          const attendanceDoc = await getDoc(
            doc(db, "classes", classId, "attendance", enrolledStudentId)
          );
          if (attendanceDoc.exists()) {
            userAttendance.attendanceData[classId] = attendanceDoc.data();
          } else {
            userAttendance.attendanceData[classId] = {
              clockIn: null,
              clockOut: null,
            };
          }
        }

        console.log("user data and attendance  ", userAttendance);

        userDataAndAttendance.push(userAttendance);
      } else {
        console.log(`No user data found for student ${enrolledStudentId}`);
      }
    }

    return userDataAndAttendance;
  } catch (error) {
    console.error("Error fetching user data and attendance:", error);
    throw error;
  }
};

export const getAllUsersAttendance = async (classId: string) => {
  try {
    const data = await getDocs(
      collection(db, "classes", classId, "attendance")
    );
    console.log("data ", data.docs);

    return data.docs;
  } catch (error) {
    console.log("error ", error);
  }
};

export const getMembersWithAttendance = async (classId: string) => {
  const members = [];

  try {
    const classDocRef = doc(db, "classes", classId);
    const attendanceCollectionRef = collection(classDocRef, "attendance");
    const attendanceSnapshot = await getDocs(attendanceCollectionRef);

    for (const attendanceDoc of attendanceSnapshot.docs) {
      const memberId = attendanceDoc.id;
      const memberData = attendanceDoc.data();
      members.push({
        id: memberId,
        ...memberData,
      });
    }

    return members;
  } catch (error) {
    console.error("Error fetching members with attendance:", error);
    throw error;
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

interface UserAttendance {
  attendanceData: any;
  userData: UserData;
}

interface RankedUser {
  userData: UserData;
  attendancePercentage: number;
  totalDuration: number; // in seconds
}

export const calculateAttendanceRanking = (
  userDataAndAttendance: UserAttendance[]
): RankedUser[] => {
  const rankedUsers: RankedUser[] = userDataAndAttendance.map(
    (userAttendance) => {
      const { userData, attendanceData } = userAttendance;

      let totalAttendancePercentage = 0;
      let totalDuration = 0;

      // Iterate through attendance data for each class
      for (const classId in attendanceData) {
        const classAttendance = attendanceData[classId];
        if (classAttendance.clockIn && classAttendance.clockOut) {
          const durationInSeconds = calculateSecondsDifference(
            classAttendance.clockIn,
            classAttendance.clockOut
          );
          console.log("duration in seconds ", durationInSeconds);
          totalDuration += durationInSeconds;
          totalAttendancePercentage += 1;
        }
      }

      // Calculate the attendance percentage and duration
      const attendancePercentage =
        (totalAttendancePercentage / userData?.enrolledCourses?.length) * 100;

      return {
        userData,
        attendancePercentage,
        totalDuration,
      };
    }
  );

  // Sort the rankedUsers array based on attendance percentage and duration
  rankedUsers.sort((a, b) => {
    // First, compare by attendance percentage
    if (a.attendancePercentage !== b.attendancePercentage) {
      return b.attendancePercentage - a.attendancePercentage;
    }
    // If attendance percentage is the same, compare by total duration
    return b.totalDuration - a.totalDuration;
  });

  return rankedUsers;
};

export const calculateTotalClassTime = async (
  courseId: string
): Promise<number> => {
  try {
    let totalDuration = 0;

    const courseDoc = await getDoc(doc(db, "courses", courseId));

    if (!courseDoc.exists()) {
      console.log(`Course with ID ${courseId} not found.`);
      return totalDuration;
    }

    const courseData = courseDoc.data();

    if (!courseData || !courseData.courseClasses) {
      console.log(`No classes found for course ${courseId}.`);
      return totalDuration;
    }

    const classPromises: Promise<IClass | null>[] =
      courseData.courseClasses.map(async (classId: string) => {
        const classDoc = await getDoc(doc(db, "classes", classId));

        if (classDoc.exists()) {
          const classData = classDoc.data();
          if (classData) {
            return {
              classId,
              classTitle: classData.classTitle,
              classStartTime: classData.classStartTime,
              classEndTime: classData.classEndTime,
            };
          }
        }
        return null;
      });

    const classes = await Promise.all(classPromises);

    for (const classInfo of classes) {
      if (classInfo) {
        const totalSeconds = calculateSecondsDifference(
          classInfo.classStartTime,
          classInfo.classEndTime
        );
        totalDuration += totalSeconds;
        // You can store or process the totalSeconds as needed
      }
    }

    return totalDuration;
  } catch (error) {
    console.error("Error calculating total class time:", error);
    throw error;
  }
};

export const calculateTotalAttendanceTime = (
  userDataAndAttendance: UserAttendance[]
): number => {
  let totalAttendanceTime: number = 0;

  userDataAndAttendance.forEach((userAttendance) => {
    const { userData, attendanceData } = userAttendance;

    let totalDurationInSeconds = 0;

    for (const classId in attendanceData) {
      const classAttendance = attendanceData[classId];

      if (classAttendance.clockIn && classAttendance.clockOut) {
        const durationInSeconds =
          classAttendance.clockOut.seconds - classAttendance.clockIn.seconds;
        totalDurationInSeconds += durationInSeconds;
      }
    }

    totalAttendanceTime += totalDurationInSeconds;
  });

  return totalAttendanceTime;
};

export const getTotalClassDurationForUser = async (
  userId: string,
  classIds: string[]
) => {
  try {
    console.log("class ids ==============", classIds);
    let totalDuration = 0;

    for (const classId of classIds) {
      const attendanceDoc = await getDoc(
        doc(db, "classes", classId, "attendance", userId)
      );
      if (attendanceDoc.exists()) {
        const attendanceData = attendanceDoc.data();

        if (attendanceData.clockIn && attendanceData.clockOut) {
          const durationInSeconds = Math.floor(
            attendanceData.clockOut.seconds - attendanceData.clockIn.seconds
          );
          totalDuration += durationInSeconds;
        }
      }
    }

    return totalDuration;
  } catch (error) {
    console.error("Error fetching user data and attendance:", error);
    throw error;
  }
};

export const getStudentsClockedIn = async (classId: string) => {
  try {
    console.log("classes id ", classId);
    const clockedInUsers = [];

    // Query the 'attendance' collection for users who are currently clocked in
    const attendanceQuery = query(
      collection(db, "classes", classId, "attendance"),
      where("clockIn", "!=", null), // Filter by users who have clocked in
      where("clockOut", "==", null) // Filter by users who have not clocked out yet
    );

    const querySnapshot = await getDocs(attendanceQuery);

    // Iterate through the query snapshot to gather clocked-in users' data
    for (const docRef of querySnapshot.docs) {
      const userId = docRef.id;
      const attendanceData = docRef.data();

      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        clockedInUsers.push({ userData, attendanceData });
      }
    }

    return clockedInUsers;
  } catch (error) {
    console.error("Error fetching clocked-in users:", error);
    throw error;
  }
};

export const getStudentsWhoAttended = async (classId: string) => {
  try {
    console.log("classes id ", classId);
    const clockedInUsers = [];

    // Query the 'attendance' collection for users who are currently clocked in
    const attendanceQuery = query(
      collection(db, "classes", classId, "attendance"),
      where("clockIn", "!=", null), // Filter by users who have clocked in
      where("clockOut", "!=", null) // Filter by users who have not clocked out yet
    );

    const querySnapshot = await getDocs(attendanceQuery);

    // Iterate through the query snapshot to gather clocked-in users' data
    for (const docRef of querySnapshot.docs) {
      const userId = docRef.id;
      const attendanceData = docRef.data();

      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        clockedInUsers.push({ userData, attendanceData });
      }
    }

    return clockedInUsers;
  } catch (error) {
    console.error("Error fetching clocked-in users:", error);
    throw error;
  }
};

export const getAllCoursesWithUniversity = async (university: any) => {
  const coursesQuery = query(
    collection(db, "courses"),
    where("university", "==", university)
  );

  let uniSpecificCourses = [];
  const coursesQuerySnapshot = getDocs(coursesQuery);
  for (const docRef of (await coursesQuerySnapshot).docs) {
    const courseData = docRef.data() as ICourse;
    uniSpecificCourses.push(courseData);
  }

  return uniSpecificCourses;
};
