import { InputField } from "../components/InputField";
import {
  View,
  Text,
  TouchableOpacity,
  InvTouchableOpacity,
} from "../components/Themed";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import uuid from "react-native-uuid";
import useUser from "../hooks/useUser";

export default function JoinCourse({ navigation }: any) {
  const { userDataPromise } = useUser();
  const theme = useColorScheme();
  const [courseCode, setCourseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (code: string) => {
    console.log(code);
    setCourseCode(code);
    console.log("working");
    console.log(courseCode);
  };

  const handleJoinCourse = () => {
    setIsLoading(true);
    // Retrieve course details based on the entered code from Firestore
    const courseRef = collection(db, "courses");
    const codeQuery = query(
      courseRef,
      where("courseLinkCode", "==", courseCode)
    );
    getDocs(codeQuery)
      .then(async (snapshot) => {
        if (snapshot.empty) {
          setIsLoading(false);
          Alert.alert("Course not found");
        } else {
          // Course found, implement logic to join the course
          const courseData = snapshot.docs[0].data();
          const courseDocRef = snapshot.docs[0];
          

          // Check if the user is already enrolled in the course
          userDataPromise
            .then(async (user: any) => {
              const queryRef = query(
                collection(db, "users"),
                where("uid", "==", user?.uid)
              );

              const userSnapshot = await getDocs(queryRef);
              const enrolledCourses =
                userSnapshot.docs[0].data()?.enrolledCourses || [];

              if (enrolledCourses.includes(snapshot.docs[0].id)) {
                // User is already enrolled in the course
                setIsLoading(false);
                Alert.alert("User is already enrolled in the course");
                return;
              }

              const userDocRef = doc(
                collection(db, "users"),
                userSnapshot.docs[0].id
              );

              // Add the course to the user's enrolled courses
              console.log('course data ', snapshot.docs[0].id)
              console.log("eno", [...enrolledCourses, snapshot.docs[0].id]);
              await updateDoc(userDocRef, {
                enrolledCourses: [...enrolledCourses, snapshot.docs[0].id],
              });

              const courseDocRef = doc(
                collection(db, "courses"),
                snapshot.docs[0].id
              );
              // Update the course's enrolled students count
              await updateDoc(courseDocRef, {
                enrolledStudents: arrayUnion(user.uid),
              });

              setIsLoading(false);
              Alert.alert("Joined Successfully")
              navigation.navigate("CourseDetails", {
                courseId: snapshot.docs[0].id,
              });
            })
            .catch((err) => {
              setIsLoading(false);
              Alert.alert("An error occurred while joining the coursesss");
              console.log(err);
            });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("Error getting course:", error);
        Alert.alert("An error occurred while joining the course");
      });
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
    });
  }, [courseCode, isLoading]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bigFont}>
          Enter the code for the course group you'd like to join.
        </Text>
        <View style={styles.inputContainer}>
          <InputField
            keyboardType="default"
            secure={false}
            placeholder="Code"
            placeholderTextColor="gray"
            value={courseCode}
            setValue={handleCodeChange}
            valid={uuid.validate(courseCode)}
          />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme === "dark" ? "#232323" : "#f4efef",
            marginBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={[
              styles.instructionsHeader,
              {
                borderBottomWidth: 1,
                borderBottomColor: theme === "dark" ? "#232323" : "#f4efef",
              },
            ]}
          >
            Instructions
          </Text>
        </View>
        <Text style={styles.info}>
          Ask your lecturer for the course code which would be available to him
          and then you can enter it here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingVertical: 30,
  },
  inputContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  bigFont: {
    fontSize: 15,
    paddingHorizontal: 20,
  },
  instructions: {
    // color: 'blue',
    fontSize: 15,
    paddingHorizontal: 20,
  },
  instructionsHeader: {
    marginTop: 10,
    fontWeight: "500",
    paddingVertical: 5,
    fontSize: 16,
    color: "#0083eb",
  },
  info: {
    fontWeight: "500",
    paddingHorizontal: 20,
  },
});
