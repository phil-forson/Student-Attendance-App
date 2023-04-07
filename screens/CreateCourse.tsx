import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, KeyboardAvoidingView } from "react-native";

export default function CreateCourse({ navigation }: any) {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseLecturerName, setCourseLecturerName] = useState("");
  const [classLocation, setClassLocation] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createCourse()}
            style={{}}
            disabled={!(courseTitle.length && courseLecturerName.length && classLocation.length) }
          >
            <Text
              style={{
                color: !(courseTitle.length && courseLecturerName.length && classLocation.length)? "#023f65" : "#008be3",
                fontSize: 16,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [courseTitle, courseLecturerName, classLocation]);

  const handleCourseTitleChange = (title: string) => {
    setCourseTitle(title);
  };

  const handleCourseLecturerName = (name: string) => {
    setCourseLecturerName(name);
  };

  const handleClassLoc = (loc: string) => {
    setClassLocation(loc);
  };

  const createCourse = () => {
    console.log(classLocation);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Enter the following details to create a course
      </Text>
      <View style={styles.inputContainer}>
        <InputField
          keyboardType="default"
          secure={false}
          placeholder="Course Title"
          placeholderTextColor="gray"
          value={courseTitle}
          setValue={handleCourseTitleChange}
        />
      </View>
      <View style={[styles.inputContainer, styles.marginVertical]}>
        <InputField
          keyboardType="default"
          secure={false}
          placeholder="Lecturer's Name"
          placeholderTextColor="gray"
          value={courseLecturerName}
          setValue={handleCourseLecturerName}
        />
      </View>
      <View style={[styles.inputContainer, styles.marginVertical]}>
        <InputField
          keyboardType="default"
          secure={false}
          placeholder="Class location"
          placeholderTextColor="gray"
          value={classLocation}
          setValue={handleClassLoc}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    marginTop: 30,
  },
  marginVertical: {
    marginVertical: 0,
  },
});
