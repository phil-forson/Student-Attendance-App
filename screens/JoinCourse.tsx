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

export default function JoinCourse({ navigation, route }: any) {
  const theme = useColorScheme();
  const { user } = useAuth();
  const { userData } = useUser();
  const [courseCode, setCourseCode] = useState("");
  const [itemSelected, setItemSelected] = useState<boolean>(false);
  const [allCourses, setAllCourses] = useState<any>([]);
  const [universityCourses, setUniversityCourses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCourseCodeChange = (title: string) => {
    console.log("all courses ", allCourses);
    const formattedInput = formatStringToCourseCode(title);
    const filteredCourses = allCourses.filter((course: ICourse) =>
      formatStringToCourseCode(course.courseCode).includes(formattedInput)
    );
    console.log("filtered courses ", filteredCourses);
    setUniversityCourses(filteredCourses);
    setItemSelected(false);
    setCourseCode(title);
  };

  const handleJoinCourse = async () => {
    console.log("joining course...");
    if (user) {
      try {
        setIsLoading(true);
        const userId = user.uid; // Replace with the actual user ID
        const formattedCourseCode = formatStringToCourseCode(courseCode);
        console.log("formatted course code ", formattedCourseCode);
        const result = await joinCourse(userId, formattedCourseCode);

        if (result.success) {
          // Course joining was successful
          Alert.alert("Success", result.message);
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
      setAllCourses(allCourses);
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
            disabled={courseCode.length < 1 || isLoading || !itemSelected}
          >
            <Text
              style={{
                color:
                  courseCode.length < 1 || isLoading || !itemSelected? "#023f65" : "#008be3",
                opacity: courseCode.length < 1 || isLoading || !itemSelected ? 0.32 : 1,
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
        <View style={styles.my}>
          <StyledInput
            value={courseCode}
            setValue={handleCourseCodeChange}
            secure={false}
            keyboardType="default"
            placeholder="Course Code eg. DCIT 400"
            placeholderTextColor="gray"
            valid={courseCode.length > 1}
          />
        </View>
        {!itemSelected && (
          <FlatList
            data={universityCourses}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  console.log("item ", item);
                  setCourseCode(item.courseCode);
                  setItemSelected(true);
                }}
                darkColor={Colors.dark.secondaryGrey}
                lightColor={Colors.light.secondaryGrey}
                style={[
                  {
                    paddingHorizontal: 20,
                    height: 55,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text>{item.courseCode}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item: any, index) => index.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
