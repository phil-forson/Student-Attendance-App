import { SafeAreaView, useColorScheme } from "react-native";
import { View, Text } from "../components/Themed";
import React, { useState } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import StyledInput from "../components/StyledInput";

export default function JoinCourse() {
  const theme = useColorScheme();
  const [courseCode, setCourseCode] = useState("");

  const handleCourseCodeChange = (title: string) => {
    setCourseCode(title);
  };

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
          <Text style={[styles.my]}>Enter the link to the course you would like to join </Text>
        </View>
        <View style={styles.mmy}>
          <StyledInput
            value={courseCode}
            setValue={handleCourseCodeChange}
            secure={false}
            keyboardType="default"
            placeholder="Course Code"
            placeholderTextColor="gray"
            valid={courseCode.length > 1}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
