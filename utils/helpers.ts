import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const fetchCourseData = async (courseId: string) => {
    const courseDoc = doc(db, "courses", courseId);
    const courseSnapshot = await getDoc(courseDoc);
    return courseSnapshot.data();
  };


export const getAllCoursesData = (enrolledCourseIds: Array<any>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<any[]> => {
    setIsLoading(true)
    const enrolledCoursesPromises = enrolledCourseIds.map((courseId: string) => fetchCourseData(courseId));
  
    console.log("courses promises ", enrolledCoursesPromises);
  
    return Promise.all(enrolledCoursesPromises)
      .then((enrolledCourses: any) => {
        setIsLoading(false);
        console.log('enrolled courses in enrolled courses ', enrolledCourses)
        return enrolledCourses;
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        throw new Error("Error obtaining enrolled courses");
      });
  };