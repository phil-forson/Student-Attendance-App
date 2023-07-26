import { Alert, SafeAreaView, useColorScheme } from "react-native";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useLayoutEffect, useState } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import StyledInput from "../components/StyledInput";
import uuid from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons";
import { joinCourse } from "../utils/helpers";
import useAuth from "../hooks/useAuth";
import { formatStringToCourseCode } from "../utils/utils";

export default function JoinCourse({ navigation }: any) {
  const theme = useColorScheme();
  const { user } = useAuth();
  const [courseCode, setCourseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCourseCodeChange = (title: string) => {
    setCourseCode(title);
  };

  const handleJoinCourse = async () => {
    console.log("joining course...");
    if(user){
      try {
        setIsLoading(true);
        const userId = user.uid; // Replace with the actual user ID
        const formattedCourseCode = formatStringToCourseCode(courseCode)
        console.log('formatted course code ', formattedCourseCode)
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={handleJoinCourse}
            style={{}}
            disabled={courseCode.length < 1 || isLoading}
          >
            <Text
              style={{
                color:
                  courseCode.length < 1 || isLoading
                    ? "#023f65"
                    : "#008be3",
                opacity: courseCode.length < 1 || isLoading ? 0.32 : 1,
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
        <View style={styles.mmy}>
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
      </View>
    </SafeAreaView>
  );
}
