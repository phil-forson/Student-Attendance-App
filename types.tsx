import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";

export type RootStackParamList = {
  Root: undefined;
  PersonalInfo: undefined;
  UniversityDetails: { firstName: string; lastName: string };
  UserStatus: { firstName: string; lastName: string; university: any };
  AccountDetails: {
    firstName: string;
    lastName: string;
    university: any;
    userStatus: string;
  };
  EmailVerification: any;
  SignUp: undefined;
  LogIn: undefined;
  NotFound: undefined;
  ForgotPassword: undefined;
  VerifyCode: {
    firstName: string;
    lastName: string;
    university: any;
    userStatus: string;
    email: string;
    password: string;
  };
  ResetPassword: undefined;
  FacialRecognition: undefined;
};

export type UserStackParamList = {
  Main: undefined;
  JoinCourse: undefined;
  CreateCourse: undefined;
  CreateClass: undefined;
  CourseDetails: undefined;
  ClassDetails: undefined;
  EditClass: undefined
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type UserStackScreenProps<Screen extends keyof UserStackParamList> =
  NativeStackScreenProps<UserStackParamList, Screen>;

export type StudentTabParamList = {
  Home: undefined;
  Attendance: undefined;
  MyCourses: undefined;
  Settings: undefined
};

export type UserTabScreenProps<Screen extends keyof StudentTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<StudentTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type CourseTabParamList = {
  Classes: any;
  Members: undefined;
};

export type CourseTabScreenProps<Screen extends keyof CourseTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<CourseTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type UserDrawerParamList = {
  Root: undefined;
  Profile: undefined;
  Settings: undefined;
};

export interface ICourseDetails {
  id: string;
  courseTitle: string;
  lecturerName: string;
  courseLinkCode: string;
  creatorId: string;
  location: any;
  courseClasses: Array<any>;
  teachers: Array<any>;
}



export interface UserData {
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: "Student"|"Lecturer"
  university?: any;
  verified?: boolean;
  enrolledCourses?: Array<any>;
}

export interface ICourse {
  courseCode: string;
  courseLinkCode: string;
  courseTitle: string;
  creatorId: string;
  enrolledStudents: Array<any>;
  lecturerName: string;
  teachers: Array<any>;
  uid: string;
}

export interface IClass {
  classTitle: string;
  uid: string;
  classLocation: any;
  classStartTime: Timestamp;
  classEndTime: Timestamp;
  classDate: Timestamp;
  courseId: string;
  courseTitle: string;
  classStatus: string;
}

export interface GroupedClasses {
  upcoming: IClass[];
  ongoing: IClass[];
  past: IClass[];
}

export interface IAttendance {
  clockIn: Date | null
  clockOut: Date | null
}