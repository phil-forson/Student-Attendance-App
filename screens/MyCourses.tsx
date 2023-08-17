import { View, Text, InvTouchableOpacity } from "../components/Themed";
import {
  Image,
  ListRenderItem,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import FullWidthButton from "../components/FullWidthButton";
import { ICourse } from "../types";
import CourseCard from "../components/CourseCard";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import { convertToHHMM } from "../utils/utils";
import { event } from "react-native-reanimated";
import { UserContext } from "../contexts/UserContext";
import GetStarted from "../components/GetStarted";
import UserStack from "../navigation/userStack";
import useUser from "../hooks/useUser";
import Loading from "../components/Loading";
import { getAllCoursesData } from "../utils/helpers";
import { AntDesign } from "@expo/vector-icons";

const ItemSeparator = () => <View style={styles.separator} />;

export default function MyCourses({ navigation, route }: any) {
  const theme = useColorScheme();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const [areCoursesLoading, setCoursesLoading] = useState<boolean>(false);

  const [coursesData, setCoursesData] = useState<Array<ICourse>>([]);

  useEffect(() => {
    if (isUserDataLoading) {
      return;
    }
    const courses =
      userData.status === "Student"
        ? userData.enrolledCourses
        : userData.createdCourses;

    if (courses.length > 0) {
      getAllCoursesData(courses, setCoursesLoading)
        .then((coursesData) => {
          // Use the enrolledCoursesData here, it will be an array of course data objects
          setCoursesData(coursesData);
        })
        .catch((error) => {
          // Handle the error here
          console.log("Error:", error.message);
        });
    }
  }, [isUserDataLoading, userData]);

  useEffect(() => {
    console.log("courses loading changed to ", areCoursesLoading);
  }, [areCoursesLoading]);

  const renderItem: ListRenderItem<ICourse> = ({ item }) => {
    return <CourseCard course={item} navigation={navigation} />;
  };

  if (isUserDataLoading) {
    return <Loading />;
  }

  if (areCoursesLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark" ? Colors.dark.background : Colors.light.background,
        },
      ]}
    >
      <View style={[styles.contentContainer, styles.transBg, {}]}>
        <View style={[styles.smy, styles.transBg]}>
          <Text
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={[styles.bold, styles.largeText]}
          >
            My Courses
          </Text>
        </View>
      </View>
      {userData?.status === "Student" && coursesData.length === 0 && (
        <GetStarted userStatus={userData?.status} navigation={navigation} />
      )}

      {userData?.status === "Teacher" && coursesData.length === 0 && (
        <GetStarted userStatus={userData?.status} navigation={navigation} />
      )}
      {userData?.status === "Student" &&
        userData?.enrolledCourses?.length > 0 && (
          <FlatList
            data={coursesData}
            keyExtractor={(courseClass: ICourse) => courseClass?.uid}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <ItemSeparator />}
            columnWrapperStyle={styles.column}
            horizontal={false}
            key={2}
            numColumns={2}
          />
        )}
      {userData?.status === "Teacher" &&
        userData?.createdCourses?.length > 0 && (
          <FlatList
            data={coursesData}
            keyExtractor={(courseClass: ICourse) => courseClass?.uid}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <ItemSeparator />}
            columnWrapperStyle={styles.column}
            horizontal={false}
            key={2}
            numColumns={2}
          />
        )}
      <InvTouchableOpacity
        style={[
          styles.addCourseIcon,
          styles.circle,
          styles.shadow,
          {
            shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
          },
        ]}
        onPress={() => {
          navigation.navigate(
            userData.status === "Student" ? "JoinCourse" : "CreateCourse"
          );
        }}
        darkColor="#0c0c0c"
      >
        <AntDesign
          name="plus"
          color={"#007bff"}
          size={18}
          style={{ fontWeight: "bold" }}
        />
      </InvTouchableOpacity>
    </SafeAreaView>
  );
}
