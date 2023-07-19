import useColorScheme from "../hooks/useColorScheme";
import { styles } from "../styles/styles";
import { IClassDetails } from "../types";
import { View, Text, InvTouchableOpacity, TouchableOpacity } from "./Themed";
import React, { useEffect } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { convertToDayString, convertToHHMM } from "../utils/utils";
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
  course: IClassDetails;
  navigation: any;
}) {
  const theme = useColorScheme();
  const width = Dimensions.get("screen").width;

  useEffect(() => {
    console.log("width ", width);
  }, []);
  return (
    <>
      <Pressable
        style={[
          ,
          {
            height: 180,
            borderRadius: 10,
            zIndex: 1,
            backgroundColor:
              theme === "dark"
                ? Colors.dark.secondaryGrey
                : Colors.light.primaryGrey,
            width: (width - 30) / 2,
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
              {course.courseName}
            </Text>
            <Text style={[styles.semiBold]}>Mr. John Doe</Text>
          </View>
          <View style={[styles.transBg, styles.flexRow, styles.itemsCenter]}>
            <Ionicons
              name="people"
              size={30}
              color={theme === "dark" ? "white" : "black"}
            />
            <Text style={[{ paddingRight: 10 }]}>127 members</Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}
