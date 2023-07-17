import useColorScheme from "../hooks/useColorScheme";
import { styles } from "../styles/styles";
import { IClassDetails } from "../types";
import { View, Text, InvTouchableOpacity, TouchableOpacity } from "./Themed";
import React from "react";
import { StyleSheet } from "react-native";
import { convertToDayString, convertToHHMM } from "../utils/utils";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function ClassCard({
  courseClass,
  navigation,
}: {
  courseClass: IClassDetails;
  navigation: any;
}) {
  const theme = useColorScheme();
  return (
    <>
      <TouchableOpacity
        style={[
          ,
          {
            height: 90,
            width: "auto",
            borderRadius: 10,
            zIndex: 1,
            borderLeftWidth: 10,
            borderLeftColor: theme === "dark"? "#fff": "#121212"
          },
        ]}
        lightColor="#ece8e8"
        darkColor="#252525"
      >
        <View
          style={[
            styles.transBg,
            styles.mmy,
            styles.mmx,
            styles.justifyBetween,
            styles.flexColumn,
            styles.flexOne,
            { paddingVertical: 10 },
          ]}
        >
          <View style={[styles.transBg]}>
            <Text style={[styles.semiBold]}>
              {convertToDayString(courseClass.date)}
            </Text>
          </View>
          <View style={[styles.flexRow, styles.justifyBetween, styles.transBg]}>
            <View
              style={[
                styles.transBg,
                styles.flexRow,
                styles.itemsCenter,
                styles.justifyBetween,
              ]}
            >
              <MaterialCommunityIcons
                name="timer-outline"
                style={[{ paddingRight: 5 }]}
                color="green"
                size={16}
              />
              <Text>{convertToHHMM(courseClass.startTime)}</Text>
            </View>
            <View
              style={[
                styles.transBg,
                styles.flexRow,
                styles.itemsCenter,
                styles.justifyBetween,
              ]}
            >
              <MaterialIcons
                name="timer-off"
                style={[{ paddingRight: 5 }]}
                color="red"
                size={16}
              />

              <Text>{convertToHHMM(courseClass.endTime)}</Text>
            </View>
            <View
              style={[
                styles.transBg,
                styles.flexRow,
                styles.itemsCenter,
                styles.justifyBetween,
              ]}
            >
              <MaterialCommunityIcons
                name="timer-sand-complete"
                size={16}
                color="#2f95dc"
              />

              <Text>{courseClass.duration}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* <View
        style={[
          { position: "relative", height: 90 ,width: 10, backgroundColor: "red", top: -90, left: 10, zIndex: 1000, borderRadius: 50 },
      
        ]}
      /> */}
    </>
  );
}
