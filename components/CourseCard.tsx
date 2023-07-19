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
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function CourseCard({
  courseClass,
  navigation,
}: {
  courseClass: IClassDetails;
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
            marginHorizontal: 5
          },
        ]}
        onPress={() => navigation.navigate("CourseDetails")}
      >
        <View
          style={[
            styles.transBg,
            styles.smy,
            styles.mmx,
            styles.justifyAround,
            styles.flexColumn,
            styles.flexOne,
            { paddingVertical: 10 },
          ]}
        >
          <View style={[styles.transBg]}>
            <Text style={[styles.semiBold]}>{courseClass.courseName}</Text>
            <Text style={[styles.semiBold]}></Text>
          </View>
        </View>
      </Pressable>
      {/* <View
        style={[
          { position: "relative", height: 90 ,width: 10, backgroundColor: "red", top: -90, left: 10, zIndex: 1000, borderRadius: 50 },
      
        ]}
      /> */}
    </>
  );
}
