import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { DATA, HomeScreen } from "../screens/HomeScreen";
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
  Ionicons
} from "@expo/vector-icons";
import SettingsScreen from "../screens/SettingsScreen";
import JoinCourse from "../screens/JoinCourse";
import { InvTouchableOpacity, TouchableOpacity } from "../components/Themed";
import CreateCourse from "../screens/CreateCourse";
import CourseDetails from "../screens/CourseDetails";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ClassHeader from "../components/ClassHeader";
import MyTabBar from "../components/MyTabBar";

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
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
    >
      <Stack.Screen
        name="Body"
        component={DrawerNavigator}
        options={(navigation: UserStackScreenProps<"Body">) => ({
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
      </Stack.Group>
      <Stack.Screen
        name="CourseDetails"
        component={BottomTabNavigator}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<CourseTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Classes"
      screenOptions={{
        tabBarActiveTintColor:
          colorScheme === "light" ? Colors.light.tint : Colors.dark.tint,
      }}
    >
      <BottomTab.Screen
        name="Classes"
        component={CourseDetails}
        options={({ navigation }: CourseTabScreenProps<"Classes">) => ({
          header: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="book-outline" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Members"
        component={ProfileScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="people-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const TopTab = createMaterialTopTabNavigator();

function TopTabNavigator(){
  return (
    <TopTab.Navigator 
    style={{
      marginTop: 200,
      backfaceVisibility: "hidden",
      backgroundColor: 'transparent'
    }}>
      <TopTab.Screen name="Past Classes" component={ProfileScreen}/>
      <TopTab.Screen name="Upcoming Classes" component={SettingsScreen} />
    </TopTab.Navigator>
  )
}

const Drawer = createDrawerNavigator<UserDrawerParamList>();

function DrawerNavigator() {
  const theme = useColorScheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
      useLegacyImplementation={false}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="book" color="#008be3" size={20} />
          ),
          drawerLabel: "My Courses",
          drawerLabelStyle: {
            color: theme === "dark" ? "#eee" : "#737171",
          },
          header: () => <UserHeader />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: () => (
            <AntDesign name="hourglass" color="#008be3" size={20} />
          ),
          drawerLabel: "Upcoming classes",
          drawerLabelStyle: {
            color: theme === "dark" ? "#eee" : "#737171",
          },
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: () => (
            <AntDesign name="setting" color="#008be3" size={20} />
          ),
          drawerLabel: "Settings",
          drawerLabelStyle: {
            color: theme === "dark" ? "#eee" : "#737171",
          },
        }}
      />
    </Drawer.Navigator>
  );
}
