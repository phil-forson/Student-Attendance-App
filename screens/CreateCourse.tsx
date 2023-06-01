import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { UserData, UserStackScreenProps } from "../types";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import useAuth from "../hooks/useAuth";

export default function CreateCourse({ navigation }: any) {
  const [courseTitle, setCourseTitle] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createCourse()}
            style={{}}
            disabled={
              !(courseTitle.length && classLocation.length) || isLoading
            }
          >
            <Text
              style={{
                color: !(courseTitle.length && classLocation.length)
                  ? "#023f65"
                  : "#008be3",
                fontSize: 16,
                opacity:
                  !(courseTitle.length && classLocation.length) || isLoading
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
  }, [courseTitle, classLocation]);

  const handleCourseTitleChange = (title: string) => {
    setCourseTitle(title);
  };

  const handleClassLoc = (loc: string) => {
    setClassLocation(loc);
  };

  const createCourse = async () => {
    setIsLoading(true);
    if (!(courseTitle.length && classLocation.length)) {
      return;
    }
    try {
      const classesCollectionRef = collection(db, "classes");

      await addDoc(classesCollectionRef, {
        courseTitle: courseTitle,
        lecturerName: userData?.firstName + " " + userData?.lastName,
        location: classLocation,
      }).then((response) => {
        console.log(response);
        navigation.navigate("Home");
      });
    } catch (e) {
      Alert.alert("Something unexpected happened. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        const userId = user.uid;

        try {
          const queryRef = query(
            collection(db, "users"),
            where("uid", "==", user?.uid)
          );

          const querySnapshot = await getDocs(queryRef);
          console.log("query Snapshot ", querySnapshot);

          if (querySnapshot.size > 0) {
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
            console.log("set");
          }
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };

    getUserData();
  }, []);
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
