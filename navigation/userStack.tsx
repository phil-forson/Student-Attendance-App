import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import {
  CourseTabParamList,
  UserDrawerParamList,
  UserStackParamList,
} from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Colors from "../constants/Colors";
import { Button } from "react-native-elements";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import SettingsScreen from "../screens/SettingsScreen";
import JoinCourse from "../screens/JoinCourse";
import { TouchableOpacity } from "../components/Themed";
import CreateCourse from "../screens/CreateCourse";
import CourseDetails from "../screens/CourseDetails";
import CreateClass from "../screens/CreateClass";
import { useNavigation } from "@react-navigation/native";
import ClassDetails from "../screens/ClassDetails";
import ClockInScreen from "../screens/ClockInScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import MyCourses from "../screens/MyCourses";

const Drawer = createDrawerNavigator<UserDrawerParamList>();

export default function UserStack() {
  const theme = useColorScheme();

  return <MainStackNavigator />;
}

const MainStack = createNativeStackNavigator<UserStackParamList>();

function MainStackNavigator() {
  const theme = useColorScheme();
  return (
    <MainStack.Navigator>
      <MainStack.Group screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="Main" component={UserBottomTabNavigator} />
        <MainStack.Screen name="CourseDetails" component={CourseDetails} />
        <MainStack.Screen name="ClassDetails" component={ClassDetails} />
      </MainStack.Group>
      <MainStack.Group
        screenOptions={({ navigation }) => ({
          presentation: "modal",
          headerLeft: () => {
            return (
              <TouchableOpacity
                lightColor="#fff"
                darkColor="#121212"
                onPress={() => navigation.goBack()}
                style={{}}
              >
                <AntDesign name="close" size={20} color={Colors.danger} />
              </TouchableOpacity>
            );
          },
        })}
      >
        <MainStack.Screen name="JoinCourse" component={JoinCourse} />
        <MainStack.Screen name="CreateCourse" component={CreateCourse} />
        <MainStack.Screen name="CreateClass" component={CreateClass} />
      </MainStack.Group>
    </MainStack.Navigator>
  );
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
        component={HomeScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <UserBottomTab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      <UserBottomTab.Screen
        name="My Courses"
        component={MyCourses}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
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

const Stack = createNativeStackNavigator();

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
        options={{
          header: () => null,
        }}
      />

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
