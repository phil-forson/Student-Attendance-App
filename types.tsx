import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";

export type RootStackParamList = {
  Root: undefined;
  SignUp: undefined;
  LogIn: undefined;
  NotFound: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  ResetPassword: undefined;
  FacialRecognition: undefined
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type UserStackParamList = {
  Home: undefined;
  JoinCourse: undefined;
  CreateCourse: undefined;
  CreateClass: undefined;
  CourseDetails: undefined;
  ClassDetails: undefined;
  ClockScreen: undefined;
};

export type UserStackScreenProps<Screen extends keyof UserStackParamList> =
  NativeStackScreenProps<UserStackParamList, Screen>;

export type UserTabParamList = {
  Home: undefined;
  Profile: undefined;
  Courses: undefined;
};

export type UserTabScreenProps<Screen extends keyof UserTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<UserTabParamList, Screen>,
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
  courseClasses: Array<any>
  teachers: Array<any>
}

export interface IClassDetails {
  classId: string;
  className: string;
  courseId: string;
  classLocation: any;
  classDate: Date;
}

export interface UserData {
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enrolledCourses?: Array<any>;
}


export interface ICourse {
  courseCode: string;
  courseLinkCode: string;
  courseTitle: string;
  creatorId: string;
  enrolledStudents: Array<any>
  lecturerName: string;
  teachers: Array<any>
  uid: string;
}

export interface IClass {
  className: string;
  classId: string;
  classLocation: any;
  classStartTime: Timestamp;
  classEndTime: Timestamp;
  classDate: Timestamp;
  courseId: string;
  classStatus: string
}