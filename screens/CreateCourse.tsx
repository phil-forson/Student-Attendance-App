import { InputField } from "../components/InputField";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  InvTouchableOpacity,
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
import { CourseContext } from "../contexts/CourseContext";
import Colors from "../constants/Colors";
import StyledInput from "../components/StyledInput";
import { styles } from "../styles/styles";
import useUserData from "../hooks/useUserData";
import useAuth from "../hooks/useAuth";
import { UserContext } from "../contexts/UserContext";
import { formatStringToCourseCode, generateUid } from "../utils/utils";
import { isCourseCodeUnique } from "../utils/helpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";


export default function CreateCourse({ navigation }: any) {
  const { user } = useAuth();
  const theme = useColorScheme();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const [courseTitle, setCourseTitle] = useState("");
  const [classLocation, setClassLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseDateFrom, setCourseDateFrom] = useState<Date>();
  const [courseDateTo, setCourseDateTo] = useState<Date>();
  const [isDatePickerFromVisible, setDatePickerFromVisibility] =
  useState(false);
const [isDatePickerToVisible, setDatePickerToVisibility] = useState(false);

  useEffect(() => {
    console.log("user data ", userData);
  }, []);

  const showDatePickerFrom = () => {
    console.log("opening modal");
    setDatePickerFromVisibility(true);
  };

  const showDatePickerTo = () => {
    console.log("opening modal");
    setDatePickerToVisibility(true);
  };

  const hideDatePickerFrom = () => {
    setDatePickerFromVisibility(false);
  };

  const hideDatePickerTo = () => {
    setDatePickerToVisibility(false);
  };

  const handleConfirmDateFrom = (date: any) => {
    const classDate = new Date(date);
    console.log(classDate);
    setCourseDateFrom(classDate);
    hideDatePickerFrom();
  };

  const handleConfirmDateTo = (date: any) => {
    const classDate = new Date(date);
    console.log(classDate);
    setCourseDateTo(classDate);
    hideDatePickerTo();
  };

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
                    : Colors.mainPurple,
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
      const formattedCourseCode = formatStringToCourseCode(courseCode);
      const isCodeUnique = await isCourseCodeUnique(formattedCourseCode);
      if (!isCodeUnique) {
        Alert.alert("There is already a course with this course code");
        console.log("code is not unqiue");
        return;
      }

      console.log("code unique ", isCodeUnique);
      const uid = generateUid();
      const coursesDocRef = doc(db, "courses", uid.toString());

      const data = {
        uid: uid,
        courseTitle: courseTitle,
        courseCode: formattedCourseCode,
        courseDateFrom: courseDateFrom,
        courseDateTo: courseDateTo,
        creatorId: user?.uid,
        lecturerName: userData?.firstName + " " + userData?.lastName,
        university: userData?.university,
        enrolledStudents: [],
        teachers: [],
        courseClasses: [],
      }

      console.log('data ', data)

      await setDoc(coursesDocRef, {
        uid: uid,
        courseTitle: courseTitle,
        courseCode: formattedCourseCode,
        courseDateFrom: courseDateFrom,
        courseDateTo: courseDateTo,
        creatorId: user?.uid,
        lecturerName: userData?.firstName + " " + userData?.lastName,
        university: userData?.university,
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
            Alert.alert("Success", "Course created successfully")
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
            value={courseCode}
            setValue={handleCourseCodeChange}
            secure={false}
            keyboardType="default"
            placeholder="Course Code"
            placeholderTextColor="gray"
            valid={courseCode.length > 1}
          />
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
        <View style={[styles.mmy]}>
          <InvTouchableOpacity
            style={[
              {
                backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
                borderWidth: courseDateFrom ? 1 : 0,
                borderColor: theme === "dark" ? "#000" : "#fff",
                borderRadius: 4,
                height: 50,
                paddingHorizontal: 20,
              },
              styles.justifyCenter,
            ]}
            onPress={showDatePickerFrom}
          >
            <Text
              style={{
                color:
                  theme === "dark"
                    ? courseDateFrom
                      ? "white"
                      : "gray"
                    : courseDateFrom
                    ? "black"
                    : "gray",
                fontSize: 13.8,
              }}
            >
              {courseDateFrom
                ? courseDateFrom?.toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Course Duration From"}
            </Text>
          </InvTouchableOpacity>
        </View>
        <View style={[styles.mmy]}>
          <InvTouchableOpacity
            style={[
              {
                backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
                borderWidth: courseDateFrom ? 1 : 0,
                borderColor: theme === "dark" ? "#000" : "#fff",
                borderRadius: 4,
                height: 50,
                paddingHorizontal: 20,
              },
              styles.justifyCenter,
            ]}
            onPress={showDatePickerTo}
          >
            <Text
              style={{
                color:
                  theme === "dark"
                    ? courseDateTo
                      ? "white"
                      : "gray"
                    : courseDateTo
                    ? "black"
                    : "gray",
                fontSize: 13.8,
              }}
            >
              {courseDateTo
                ? courseDateTo?.toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Course Duration To"}
            </Text>
          </InvTouchableOpacity>
        </View>
        <DateTimePickerModal
        isVisible={isDatePickerFromVisible}
        mode="date"
        date={courseDateFrom ?? new Date(Date.now())}
        onConfirm={handleConfirmDateFrom}
        onCancel={hideDatePickerFrom}
      />
      <DateTimePickerModal
        isVisible={isDatePickerToVisible}
        mode="date"
        date={courseDateTo ?? new Date(Date.now())}
        onConfirm={handleConfirmDateTo}
        onCancel={hideDatePickerTo}
      />
      </View>
    </SafeAreaView>
  );
}
