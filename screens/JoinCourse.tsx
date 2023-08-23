import { Alert, SafeAreaView, useColorScheme } from "react-native";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import StyledInput from "../components/StyledInput";
import uuid from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons";
import { getAllCoursesWithUniversity, joinCourse } from "../utils/helpers";
import useAuth from "../hooks/useAuth";
import { formatStringToCourseCode } from "../utils/utils";
import useUser from "../hooks/useUser";
import { FlatList } from "react-native";
import { ICourse } from "../types";
import { SelectList } from "react-native-dropdown-select-list";

export default function JoinCourse({ navigation, route }: any) {
  const theme = useColorScheme();
  const { user } = useAuth();
  const { userData } = useUser();
  const [courseCode, setCourseCode] = useState("");
  const [dropdownCourses, setDropdownCourses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("course code changed to ", courseCode);
  }, [courseCode]);

  const handleJoinCourse = async () => {
    console.log("joining course...");
    if (user) {
      try {
        setIsLoading(true);
        const userId = user.uid; // Replace with the actual user ID
        const formattedCourseCode = formatStringToCourseCode(courseCode);
        const result = await joinCourse(userId, formattedCourseCode);

        if (result.success) {
          // Course joining was successful
          Alert.alert("Success", result.message);
          navigation.goBack()
          // Additional actions after successful course joining can be added here
        } else {
          // Course joining failed
          Alert.alert("Error", result.message);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error joining course:", error);
        setIsLoading(false);
        Alert.alert("Error", "An error occurred while joining the course.");
      }
    }
  };

  useEffect(() => {
    const getCoursesData = async () => {
      console.log("user data ", route.params);
      const allCourses = await getAllCoursesWithUniversity(
        route.params.university
      );
      let preparedCourses = allCourses.map((course: ICourse) => {
        return { id: course.uid, value: course.courseCode };
      });
      setDropdownCourses(preparedCourses);
    };
    getCoursesData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={handleJoinCourse}
            style={{}}
            disabled={courseCode.length < 1 || isLoading}
          >
            <Text
              style={{
                color:
                  courseCode.length < 1 || isLoading ? "#023f65" : "#008be3",
                opacity: courseCode.length < 1 || isLoading ? 0.32 : 1,
                fontSize: 16,
              }}
            >
              Join
            </Text>
          </TouchableOpacity>
        );
      },
      headerLeft: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => navigation.goBack()}
            style={{}}
          >
            <AntDesign
              name="close"
              size={20}
              color={theme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        );
      },
      title: "",
    });
  }, [courseCode, isLoading]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark"
              ? Colors.dark.primaryGrey
              : Colors.light.primaryGrey,
        },
      ]}
    >
      <View style={[styles.contentContainer, styles.transBg]}>
        <View style={[styles.smy, styles.transBg]}>
          <Text style={[styles.bold, styles.largeText]}>Join Course</Text>
          <Text style={[styles.my]}>
            Enter the link to the course you would like to join{" "}
          </Text>
        </View>
        <View style={[styles.mmy]}>
          <SelectList
            placeholder="Course Code eg. DCIT 400"
            searchPlaceholder="Course Code"
            boxStyles={{
              backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
              borderWidth: 0,
              height: 55,
              paddingHorizontal: 20,
              alignItems: "center",
              borderRadius: 0,
              padding: 0,
            }}
            inputStyles={{
              color:
                theme === "dark"
                  ? courseCode
                    ? "white"
                    : "gray"
                  : courseCode
                  ? "black"
                  : "gray",
            }}
            dropdownStyles={{
              borderColor: theme === "dark" ? "#000" : "#fff",
              backgroundColor: theme === "dark" ? "#302e2e" : "#fff",
              paddingHorizontal: 5,
              paddingVertical: 0,
              borderRadius: 0,
            }}
            dropdownItemStyles={{
              paddingVertical: 1,
              height: 50,
              justifyContent: "center",
              borderBottomWidth: 0.2,
              borderBottomColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.primaryGrey,
            }}
            search
            setSelected={(val: string) => setCourseCode(val)}
            data={dropdownCourses}
            save="value"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
