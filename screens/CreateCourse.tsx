import { InputField } from "../components/InputField";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { UserData, UserStackScreenProps } from "../types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import useUser from "../hooks/useUser";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import uuid from "react-native-uuid";
import { CourseContext } from "../contexts/CourseContext";
import Colors from "../constants/Colors";
import StyledInput from "../components/StyledInput";
import { styles } from "../styles/styles";
import useUserData from "../hooks/useUserData";
import useAuth from "../hooks/useAuth";
import { UserContext } from "../contexts/UserContext";

export default function CreateCourse({ navigation }: any) {
  const { user } = useAuth();
  const theme = useColorScheme();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const [courseTitle, setCourseTitle] = useState("");
  const [classLocation, setClassLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [courseCode, setCourseCode] = useState("");

  useEffect(() => {
    console.log("user data ", userData);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createCourse()}
            style={{}}
            disabled={!(courseTitle.length && courseCode.length) || isLoading}
          >
            <Text
              style={{
                color:
                  !(courseTitle.length && courseCode.length) || isLoading
                    ? "#0874b8"
                    : "#008be3",
                fontSize: 16,
                opacity:
                  !(courseTitle.length && courseCode.length) || isLoading
                    ? 0.32
                    : 1,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [courseTitle, courseCode, isLoading, navigation]);

  const generateCourseCode = () => {
    return uuid.v4(); // Generate a 6-character unique code using nanoid library
  };

  const handleCourseTitleChange = (title: string) => {
    setCourseTitle(title);
  };

  const handleCourseCodeChange = (title: string) => {
    setCourseCode(title);
  };

  useEffect(() => {
    console.log("disabled", !(courseTitle.length && courseCode.length));
  }, [isLoading, courseCode, courseTitle]);

  const createCourse = async () => {
    console.log("course creation");
    setIsLoading(true);
    if (!(courseTitle.length && courseCode.length)) {
      setIsLoading(false);
      return;
    }
    try {
      const uid = generateCourseCode();
      const courseLinkCode = generateCourseCode();
      const coursesDocRef = doc(db, "courses", uid.toString());

      await setDoc(coursesDocRef, {
        uid: uid,
        courseTitle: courseTitle,
        courseCode: courseCode,
        courseLinkCode: courseLinkCode,
        creatorId: user?.uid,
        lecturerName: userData?.firstName + " " + userData?.lastName,
        enrolledStudents: [],
        teachers: [],
        courseClasses: [],
      })
        .then(async () => {
          const userId = user?.uid ?? "";
          const userRef = getDoc(doc(db, "users", userId));
          const userData = (await userRef).data();
          let createdCourses = userData?.createdCourses ?? [];
          createdCourses.push(uid.toString());

          await updateDoc(doc(db, "users", userId), {
            createdCourses: createdCourses,
          }).then(() => {
            navigation.goBack();
          });
        })
        .catch((e) => {
          Alert.alert("Something unexpected happened, try again later");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
      Alert.alert("Something unexpected happenedd. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("class location changed to ", classLocation);
  }, [classLocation]);

  if (isUserDataLoading) {
    return <ActivityIndicator />;
  }
  return (
    <SafeAreaView
      style={styles.container}
      lightColor={Colors.light.background}
      darkColor={Colors.dark.primaryGrey}
    >
      <View style={[styles.contentContainer, styles.transBg]}>
        <View style={[styles.smy, styles.transBg]}>
          <Text style={[styles.bold, styles.largeText]}>Create Course</Text>
          <Text style={[styles.my]}>
            Enter the details of the course you would like to create
          </Text>
        </View>
        <View style={styles.mmy}>
          <StyledInput
            value={courseTitle}
            setValue={handleCourseTitleChange}
            secure={false}
            keyboardType="default"
            placeholder="Course Title"
            placeholderTextColor="gray"
            valid={courseTitle.length > 1}
          />
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
