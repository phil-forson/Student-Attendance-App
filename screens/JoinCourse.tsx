import { SafeAreaView, useColorScheme } from "react-native";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useLayoutEffect, useState } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import StyledInput from "../components/StyledInput";
import uuid from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons"


export default function JoinCourse({navigation}: any) {
  const theme = useColorScheme();
  const [courseCode, setCourseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCourseCodeChange = (title: string) => {
    setCourseCode(title);
  };

  const handleJoinCourse = () => {
    console.log('joining course...')
  }




  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={handleJoinCourse}
            style={{}}
            disabled={!uuid.validate(courseCode) || isLoading}
          >
            <Text
              style={{
                color:
                  !uuid.validate(courseCode) || isLoading
                    ? "#023f65"
                    : "#008be3",
                opacity: !uuid.validate(courseCode) || isLoading ? 0.32 : 1,
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
            <AntDesign name="close" size={20} color={theme === "dark" ? "white": "black"}/>
          </TouchableOpacity>
        );
      },
    title: ""
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
