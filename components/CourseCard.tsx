import useColorScheme from "../hooks/useColorScheme";
import { styles } from "../styles/styles";
import { ICourse } from "../types";
import { View, Text, InvTouchableOpacity, TouchableOpacity } from "./Themed";
import React, { useEffect } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import {
  convertToDayString,
  convertToHHMM,
  truncateTextWithEllipsis,
} from "../utils/utils";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function CourseCard({
  course,
  navigation,
}: {
  course: ICourse;
  navigation: any;
}) {
  const theme = useColorScheme();
  const width = Dimensions.get("screen").width;

  useEffect(() => {
    console.log("width ", width);
    console.log("course ", course);
  }, []);
  return (
    <>
      <Pressable
        style={[
          {
            height: 180,
            borderRadius: 10,
            zIndex: 1,
            backgroundColor:
              theme === "dark"
                ? Colors.dark.secondaryGrey
                : Colors.light.primaryGrey,
            marginHorizontal: 5,
          },
        ]}
        onPress={() => navigation.navigate("CourseDetails", course)}
      >
        <View
          style={[
            styles.transBg,
            styles.smy,
            styles.flexColumn,
            styles.justifyBetween,
            styles.flexOne,
            { paddingVertical: 30, paddingHorizontal: 15 },
          ]}
        >
          <View style={[styles.transBg]}>
            <Text style={[styles.semiBold, styles.largeText]}>
              {truncateTextWithEllipsis(course?.courseTitle, 23)}
            </Text>
            <Text style={[styles.semiBold, ]}>{course?.courseCode}</Text>
            <Text style={[styles.semiBold]}>{course?.lecturerName}</Text>
          </View>
          <View style={[styles.transBg, styles.flexRow, styles.itemsCenter]}>
            <Ionicons
              name="people"
              size={30}
              color={theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple}
              style={[{paddingRight: 10}]}
            />
            <Text style={[{ paddingRight: 10 }]}>
              {course?.enrolledStudents?.length} student
              {course?.enrolledStudents.length === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}
