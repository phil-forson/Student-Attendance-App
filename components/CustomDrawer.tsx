import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "./Themed";
import { Alert, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../config/firebase";
import { useTheme } from "@react-navigation/native";
import useColorScheme from "../hooks/useColorScheme";
import { ICourseDetails } from "../types";
import Colors from "../constants/Colors";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import useUser from "../hooks/useUser";

const CustomDrawer = (props: any) => {
  const { user } = useAuth();
  const { userDataPromise } = useUser()
  const [signOut, setSignout] = useState(false);
  const [courses, setCourses] = useState([])

  const handleSignOut = () => {
    auth.signOut();
  };

  const theme = useColorScheme();

  const fetchCourses = async () => {
    await userDataPromise
      .then((res: any) => {
        const enrolledCourseIds = res.enrolledCourses;
  
        // Fetch the enrolled courses based on the course IDs
        const enrolledCoursesPromises = enrolledCourseIds.map(async (courseId: string) => {
          const courseDoc = doc(db, "courses", courseId);
          const courseSnapshot = await getDoc(courseDoc);
          return courseSnapshot.data();
        });
  
        // Wait for all the enrolled courses to be fetched
        Promise.all(enrolledCoursesPromises)
          .then((enrolledCourses: any) => {
            setCourses(enrolledCourses);
            console.log('enrolled courses ', enrolledCourses);
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Error obtaining enrolled courses");
          });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error obtaining user data");
      })
      .finally(() => {
      });
  };
  useEffect(() => {
    fetchCourses()
  }, [])
  
  return (
    <View
      darkColor="#121212"
      style={{
        flex: 1,
      }}
    >
      <DrawerContentScrollView
        {...props}
        style={[styles.view, styles.marginVertical, {}]}
      >
        <View
          style={[
            {
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 10,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <View>
              <Image
                source={require("../assets/profileimg.png")}
                style={{
                  height: 55,
                  width: 55,
                }}
              />
            </View>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 13,
                color: "#008be3",
              }}
            >
              @{user?.email}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingTop: 10,
              borderBottomWidth: 0.7,
              borderBottomColor: theme === "dark" ? "#232323" : "#737171",
            },
          ]}
        >
          <DrawerItem
            label={() => {
              return (
                <View style={{ flexDirection: "row" }}>
                  <AntDesign
                    name="book"
                    size={20}
                    color={theme === "dark" ? "#eee" : "#737171"}
                  />
                  <Text
                    style={{
                      marginLeft: 33,
                      fontSize: 14,
                      fontWeight: "500",
                      color: theme === "dark" ? "#eee" : "#737171",
                    }}
                  >
                    My Courses
                  </Text>
                </View>
              );
            }}
            onPress={() =>
              props.navigation.navigate("Root", { screen: "Home" })
            }
            activeTintColor={theme === "dark" ? "#fbfcfd": "#2f95dc"}
          />
          <DrawerItemList {...props} />
        </View>
        <View
          style={{
            borderBottomWidth: 0.7,
            borderBottomColor: theme === "dark" ? "#232323" : "#737171",
          }}
        >
          {courses.map((course: ICourseDetails, index: number) => {
            return (
              <DrawerItem
                key={index}
                label={() => {
                  return (
                    <View style={{ flexDirection: "row" }}>
                      <AntDesign
                        name="book"
                        size={20}
                        color={theme === "dark" ? "#eee" : "#737171"}
                      />
                      <Text
                        style={{
                          marginLeft: 33,
                          fontSize: 14,
                          fontWeight: "500",
                          color: theme === "dark" ? "#eee" : "#737171",
                        }}
                      >
                        {course.courseTitle}
                      </Text>
                    </View>
                  );
                }}
                onPress={() =>
                  props.navigation.navigate("Root", {
                    screen: "CourseDetails",
                    params: {
                      screen: "Classes",
                      params: course,
                    },
                  })
                }
              />
            );
          })}
        </View>
        <View
          style={[
            {
              paddingTop: 15,
              paddingBottom: 20,
              paddingHorizontal: 20,
              justifyContent: "center",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
          ]}
        >
          <TouchableOpacity
            darkColor="#121212"
            lightColor="#eee"
            style={{
              flexDirection: "row",
            }}
            onPress={() =>
              Alert.alert("Sign Out", "Do you want to continue to sign out?", [
                {
                  text: "No",
                  onPress: () => setSignout(false),
                },
                {
                  text: "Yes",
                  onPress: handleSignOut,
                },
              ])
            }
          >
            <AntDesign name="logout" size={20} color="red" />
            <Text style={{ marginLeft: 33, fontSize: 15 }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 10,
    marginHorizontal: 5,
  },
  marginTop: {
    marginTop: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  marginVertical: {},
});

export default CustomDrawer;
