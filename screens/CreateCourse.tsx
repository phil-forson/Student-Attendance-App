import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { UserStackScreenProps } from "../types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import useAuth from "../hooks/useAuth";

export default function CreateCourse({ navigation }: any) {
  const [courseTitle, setCourseTitle] = useState("");
  const [classLocation, setClassLocation] = useState("");

  const { user } = useAuth()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createCourse()}
            style={{}}
            disabled={!(courseTitle.length && classLocation.length) }
          >
            <Text
              style={{
                color: !(courseTitle.length && classLocation.length)? "#023f65" : "#008be3",
                fontSize: 16,
                opacity: !(courseTitle.length && classLocation.length)? 0.32 : 1
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        );
      },
    });

  }, [courseTitle, classLocation]);

  const handleCourseTitleChange = (title: string) => {
    setCourseTitle(title);
  };


  const handleClassLoc = (loc: string) => {
    setClassLocation(loc);
  };

  const createCourse = () => {
    if(!(courseTitle.length && classLocation.length)){
      return;
    }
    try {
      const classesCollectionRef = collection(db, 'classes');

      const newCourse = addDoc(classesCollectionRef, {
        courseTitle: courseTitle,
        lecturerName: user?.displayName,
        location: classLocation
      })


    }
    catch(e){
      Alert.alert("Something unexpected happened. Try again later.")
    }
    // navigation.navigate('Home')
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
