import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Root: undefined;
  SignIn: undefined;
  LogIn: undefined;
  NotFound: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  ResetPassword: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type UserStackParamList = {
  Home: undefined;
  JoinCourse: undefined;
  CreateCourse: undefined;
  CreateClass: undefined;
  CourseDetails: undefined;
};

export type UserStackScreenProps<Screen extends keyof UserStackParamList> =
  NativeStackScreenProps<UserStackParamList, Screen>;

export type UserTabParamList = {
  Home: undefined,
  Profile: undefined,
  Courses: undefined
}


export type UserTabScreenProps<Screen extends keyof UserTabParamList> = CompositeScreenProps<
BottomTabScreenProps<UserTabParamList, Screen>,
NativeStackScreenProps<RootStackParamList>
>;

export type CourseTabParamList = {
  Classes: any,
  Members: undefined
}

export type CourseTabScreenProps<Screen extends keyof CourseTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<CourseTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type UserDrawerParamList = {
  Root: undefined,
  Profile: undefined,
  Settings: undefined
}

export interface ICourseDetails {
  id: string,
  courseName: string,
  lecturerName: string
}

export interface IClassDetails {
  id: string,
  className: string,
  duration: string
}

export interface UserData {
  uid?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  enrolledCourses?: Array<any>
}