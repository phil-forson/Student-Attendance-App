import { Image, useColorScheme } from "react-native";
import FullWidthButton from "./FullWidthButton";
import { View, Text } from "./Themed";
import React from "react";
import { styles } from "../styles/styles";

export default function GetStarted({ navigation, userStatus }: any) {
  const theme = useColorScheme();
  return (
    <View
      style={[
        styles.justifyBetween,
        styles.my,
        styles.transBg,
        {
          marginVertical: 40,
          marginHorizontal: 30,
        },
      ]}
    >
      <Image
        source={require("../assets/course.png")}
        style={[{ resizeMode: "contain", width: "auto", height: 250 }]}
      />
      <Text
        style={[
          styles.textCenter,
          styles.semiBold,
          styles.mediumText,
          styles.my,
        ]}
      >
        {userStatus === "Student" ? "Join" : "Teacher" ? "Create" : ""} a course
        to get started
      </Text>
      <FullWidthButton
        text={userStatus === "Student" ? "Join Course" : "Create Course"}
        style={[
          styles.fullWidth,
          {
            backgroundColor: theme === "dark" ? "#121212" : "#fff",
          },
        ]}
        onPress={() => {
          navigation.navigate(
            userStatus === "Student" ? "JoinCourse" : "CreateCourse"
          );
        }}
      />
    </View>
  );
}
