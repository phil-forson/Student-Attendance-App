import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import {
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
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import SettingsScreen from "../screens/SettingsScreen";
import JoinCourse from "../screens/JoinCourse";
import { InvTouchableOpacity, TouchableOpacity } from "../components/Themed";

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  const theme = useColorScheme()
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
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="Options" component={JoinCourse} options={( { navigation }: UserStackScreenProps<'Options'>) => ({
          headerLeft: () => {
            return (
              <InvTouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="window-close" size={25} color={theme !== (null || undefined) ? Colors[theme !== null ? theme : 'light'].text : 'white'}/>
              </InvTouchableOpacity>
            )
            },
            title: 'Join Course',
            headerTitleStyle: {
              fontSize: 16,
              
            },
            

        })}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<UserTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor:
          colorScheme === "light" ? Colors.light.tint : Colors.dark.tint,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: UserTabScreenProps<"Home">) => ({
          header: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Courses"
        component={ProfileScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user-circle" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

const Drawer = createDrawerNavigator<UserDrawerParamList>();

function DrawerNavigator() {
  const theme = useColorScheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "transparent" },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: () => (
            <MaterialIcons
              name="book"
              color={theme === "dark" ? "#737171" : "#000"}
              size={20}
            />
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
            <AntDesign
              name="hourglass"
              color={theme === "dark" ? "#737171" : "#737171"}
              size={20}
            />
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
            <AntDesign
              name="setting"
              color={theme === "dark" ? "#737171" : "#000"}
              size={20}
            />
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
