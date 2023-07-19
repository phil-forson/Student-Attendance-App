import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import {
  CourseTabParamList,
  CourseTabScreenProps,
  ICourseDetails,
  UserDrawerParamList,
  UserStackParamList,
  UserStackScreenProps,
  UserTabParamList,
  UserTabScreenProps,
} from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Colors from "../constants/Colors";
import { Pressable } from "react-native/Libraries/Components/Pressable/Pressable";
import { ProfileScreen } from "../screens/ProfileScreen";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import { Button } from "react-native-elements";
import CustomDrawer from "../components/CustomDrawer";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import SettingsScreen from "../screens/SettingsScreen";
import JoinCourse from "../screens/JoinCourse";
import { InvTouchableOpacity, TouchableOpacity } from "../components/Themed";
import CreateCourse from "../screens/CreateCourse";
import CourseDetails from "../screens/CourseDetails";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ClassHeader from "../components/ClassHeader";
import MyTabBar from "../components/MyTabBar";
import CreateClass from "../screens/CreateClass";
import CourseMembersScreen from "../screens/CourseMembersScreen";
import { useNavigation } from "@react-navigation/native";
import ClassDetails from "../screens/ClassDetails";
import ClockInScreen from "../screens/ClockInScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import MyCourses from "../screens/MyCourses";

const Drawer = createDrawerNavigator<UserDrawerParamList>();

export default function UserStack() {
  const theme = useColorScheme();

  return (
    // <Drawer.Navigator
    //   screenOptions={{
    //     headerShown: false,
    //   }}
    //   drawerContent={(props) => <CustomDrawer {...props} />}
    //   useLegacyImplementation={false}
    // >
    //   <Drawer.Screen
    //     name="Root"
    //     component={StackNavigator}
    //     options={{
    //       drawerLabel: () => null,
    //     }}
    //   />
    //   <Drawer.Screen
    //     name="Profile"
    //     component={ProfileScreen}
    //     options={{
    //       drawerIcon: () => (
    //         <AntDesign name="hourglass" color="#008be3" size={20} />
    //       ),
    //       drawerLabel: "Upcoming classes",
    //       drawerLabelStyle: {
    //         color: theme === "dark" ? "#fff" : "#737171",
    //       },
    //     }}
    //   />
    //   <Drawer.Screen
    //     name="Settings"
    //     component={SettingsScreen}
    //     options={{
    //       drawerIcon: () => (
    //         <AntDesign name="setting" color="#008be3" size={20} />
    //       ),
    //       drawerLabel: "Settings",
    //       drawerLabelStyle: {
    //         color: theme === "dark" ? "#fff" : "#737171",
    //       },
    //     }}
    //   />
    // </Drawer.Navigator>
    // <Stack.Navigator
    //   screenOptions={{
    //     gestureEnabled: true,
    //     gestureDirection: "horizontal",
    //     headerLeft: () => {
    //       return <Button />;
    //     },
    //   }}
    //   initialRouteName="Home"
    // >
    //   <Stack.Screen
    //     name="Home"
    //     component={HomeScreen}
    //     options={(navigation: UserStackScreenProps<"Home">) => ({
    //       header: () => null,
    //     })}
    //   />
    //   <Stack.Group screenOptions={{ presentation: "modal" }}>
    //     <Stack.Screen
    //       name="JoinCourse"
    //       component={JoinCourse}
    //       options={({ navigation }: UserStackScreenProps<"JoinCourse">) => ({
    //         headerLeft: () => {
    //           return (
    //             <InvTouchableOpacity onPress={() => navigation.goBack()}>
    //               <MaterialCommunityIcons
    //                 name="window-close"
    //                 size={25}
    //                 color={
    //                   theme !== (null || undefined)
    //                     ? Colors[theme !== null ? theme : "light"].text
    //                     : "white"
    //                 }
    //               />
    //             </InvTouchableOpacity>
    //           );
    //         },
    //         title: "Join Course",
    //         headerTitleStyle: {
    //           fontSize: 16,
    //         },
    //       })}
    //     />
    //     <Stack.Screen
    //       name="CreateCourse"
    //       component={CreateCourse}
    //       options={({ navigation }: UserStackScreenProps<"CreateCourse">) => ({
    //         headerLeft: () => {
    //           return (
    //             <InvTouchableOpacity onPress={() => navigation.goBack()}>
    //               <MaterialCommunityIcons
    //                 name="window-close"
    //                 size={25}
    //                 color={
    //                   theme !== (null || undefined)
    //                     ? Colors[theme !== null ? theme : "light"].text
    //                     : "white"
    //                 }
    //               />
    //             </InvTouchableOpacity>
    //           );
    //         },
    //         title: "Create Course",
    //         headerTitleStyle: {
    //           fontSize: 16,
    //         },
    //       })}
    //     />
    //     <Stack.Screen
    //       name="CreateClass"
    //       component={CreateClass}
    //       options={({ navigation }: UserStackScreenProps<"CreateClass">) => ({
    //         headerLeft: () => {
    //           return (
    //             <InvTouchableOpacity onPress={() => navigation.goBack()}>
    //               <MaterialCommunityIcons
    //                 name="window-close"
    //                 size={25}
    //                 color={
    //                   theme !== (null || undefined)
    //                     ? Colors[theme !== null ? theme : "light"].text
    //                     : "white"
    //                 }
    //               />
    //             </InvTouchableOpacity>
    //           );
    //         },
    //         title: "Create Class",
    //         headerTitleStyle: {
    //           fontSize: 16,
    //         },
    //       })}
    //     />
    //   </Stack.Group>
    //   <Stack.Screen
    //     name="CourseDetails"
    //     component={BottomTabNavigator}
    //     options={{ header: () => null }}
    //   />
    //   <Stack.Screen
    //     name="ClassDetails"
    //     component={ClassDetails}
    //     options={{ header: () => null }}
    //   />
    //   <Stack.Screen
    //     name="ClockScreen"
    //     component={ClockInScreen}
    //     options={{ header: () => null }}
    //   />
    // </Stack.Navigator>  );
    <UserBottomTabNavigator />
  )
}

const handleGoToMembersScreen = () => {};

const UserBottomTab = createBottomTabNavigator();

function UserBottomTabNavigator() {
  const colorScheme = useColorScheme();

  const navigation = useNavigation<any>();

  const navigateToMembersScreen = () => {
    navigation.navigate("Members", { userId: 123 });
  };

  return (
    <UserBottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor:
          colorScheme === "light" ? Colors.light.tint : Colors.dark.tint,
      }}
    >
      <UserBottomTab.Screen
        name="Home"
        component={StackNavigator}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <UserBottomTab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="people-outline" color={color} />
          ),
        }}
      />
      <UserBottomTab.Screen
        name="My Courses"
        component={MyCourses}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book" color={color} />
          ),
        }}
      />
      <UserBottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
    </UserBottomTab.Navigator>
  );
}


const BottomTab = createBottomTabNavigator<CourseTabParamList>();



function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const Stack = createNativeStackNavigator<UserStackParamList>();

function StackNavigator() {
  const theme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerLeft: () => {
          return <Button />;
        },
      }}
      initialRouteName="Root"
    >
      <Stack.Screen
        name="Root"
        component={HomeScreen}
        options={(navigation: UserStackScreenProps<"Root">) => ({
          header: () => null,
        })}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="JoinCourse"
          component={JoinCourse}
          options={({ navigation }: UserStackScreenProps<"JoinCourse">) => ({
            headerLeft: () => {
              return (
                <InvTouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons
                    name="window-close"
                    size={25}
                    color={
                      theme !== (null || undefined)
                        ? Colors[theme !== null ? theme : "light"].text
                        : "white"
                    }
                  />
                </InvTouchableOpacity>
              );
            },
            title: "Join Course",
            headerTitleStyle: {
              fontSize: 16,
            },
          })}
        />
        <Stack.Screen
          name="CreateCourse"
          component={CreateCourse}
          options={({ navigation }: UserStackScreenProps<"CreateCourse">) => ({
            headerLeft: () => {
              return (
                <InvTouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons
                    name="window-close"
                    size={25}
                    color={
                      theme !== (null || undefined)
                        ? Colors[theme !== null ? theme : "light"].text
                        : "white"
                    }
                  />
                </InvTouchableOpacity>
              );
            },
            title: "Create Course",
            headerTitleStyle: {
              fontSize: 16,
            },
          })}
        />
        <Stack.Screen
          name="CreateClass"
          component={CreateClass}
          options={({ navigation }: UserStackScreenProps<"CreateClass">) => ({
            headerLeft: () => {
              return (
                <InvTouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons
                    name="window-close"
                    size={25}
                    color={
                      theme !== (null || undefined)
                        ? Colors[theme !== null ? theme : "light"].text
                        : "white"
                    }
                  />
                </InvTouchableOpacity>
              );
            },
            title: "Create Class",
            headerTitleStyle: {
              fontSize: 16,
            },
          })}
        />
      </Stack.Group>
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetails}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ClassDetails"
        component={ClassDetails}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ClockScreen"
        component={ClockInScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
