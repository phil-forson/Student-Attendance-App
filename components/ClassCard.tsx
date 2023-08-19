import useColorScheme from "../hooks/useColorScheme";
import { styles } from "../styles/styles";
import { IClass} from "../types";
import { View, Text, InvTouchableOpacity, TouchableOpacity } from "./Themed";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { calculateDuration, convertToDayString, convertToHHMM } from "../utils/utils";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function ClassCard({
  courseClass,
  navigation,
  onPress
}: {
  courseClass: IClass;
  navigation: any;
  onPress?: any
}) {
  const theme = useColorScheme();

  const navigateToClassDetails = () => {
    navigation.navigate("ClassDetails", courseClass)
  }
  return (
    <>
      <Pressable
        style={[
          ,
          {
            height: 90,
            width: "auto",
            borderRadius: 10,
            zIndex: 1,
            borderLeftWidth: 10,
            borderLeftColor: theme === "dark" ? Colors.dark.text : Colors.mainPurple,
            backgroundColor:
              theme === "dark"
                ? Colors.dark.secondaryGrey
                : Colors.light.primaryGrey,
          },
        ]}
        onPress={onPress ?? navigateToClassDetails}
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
            <Text style={[styles.semiBold]}>{courseClass.classTitle}</Text>
            <Text style={[styles.semiBold]}>{convertToDayString(courseClass.classDate.toDate())}</Text>
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
              <Text>{convertToHHMM(courseClass.classStartTime.toDate())}</Text>
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

              <Text>{convertToHHMM(courseClass.classEndTime.toDate())}</Text>
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

              <Text>{calculateDuration(courseClass.classStartTime, courseClass.classEndTime)}</Text>
            </View>
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
