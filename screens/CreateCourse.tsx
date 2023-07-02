import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import { UserData, UserStackScreenProps } from "../types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import useUser from "../hooks/useUser";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import SearchableDropdown from "react-native-searchable-dropdown";
import uuid from "react-native-uuid";
import { CourseContext } from "../contexts/CourseContext";

export default function CreateCourse({ navigation }: any) {
  const { userDataPromise } = useUser();
  const theme = useColorScheme();

  const { enrolledCourses, setEnrolledCoursesData } = useContext(CourseContext);

  const [courseTitle, setCourseTitle] = useState("");
  const [classLocation, setClassLocation] = useState({});
  const [classLocationSearch, setClassLocationSearch] = useState("");
  const [classLocationData, setClassLocationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [places, setPlaces] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);

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
  }, [courseTitle, courseCode, isLoading]);

  useEffect(() => {
    console.log("places changed to ", places);
  }, [places]);

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
  // const handleClassLocChange = async (loc: string) => {
  //   setIsItemSelected(false);
  //   setClassLocationSearch(loc);
  //   setIsPlacesLoading(true);
  //   const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${loc}&countrycodes=GH`;
  //   try {
  //     console.log("trying");
  //     await axios
  //       .get(apiUrl)
  //       .then((response) => {
  //         const data = response.data;
  //         console.log("data ", data);
  //         const placesData = data.map((location: any) => ({
  //           id: location.place_id,
  //           name: location.display_name,
  //           boundingBox: location.boundingbox,
  //         }));
  //         setPlaces(placesData);
  //         setIsPlacesLoading(false);
  //       })
  //       .catch((e) => console.log("places error ", e));
  //   } catch (error) {
  //     setIsPlacesLoading(false);
  //     // Handle error
  //     console.error(error);
  //   }
  // };

  const createCourse = async () => {
    console.log("course creation");
    setIsLoading(true);
    if (!(courseTitle.length && courseCode.length)) {
      setIsLoading(false);
      return;
    }
    try {
      await userDataPromise
        .then(async (res: any) => {
          const courseLinkCode = generateCourseCode();
          const coursesCollectionRef = collection(db, "courses");

          await addDoc(coursesCollectionRef, {
            uid: uuid.v4(),
            courseTitle: courseTitle,
            courseCode: courseCode,
            courseLinkCode: courseLinkCode,
            creatorId: res?.uid,
            lecturerName: res?.firstName + " " + res?.lastName,
            enrolledStudents: [],
            teachers: [],
            courseClasses: [],
          })
            .then(async (response: any) => {
              console.log("create course response ", response);
              const queryRef = query(
                collection(db, "users"),
                where("uid", "==", res.uid)
              );
              await getDocs(queryRef)
                .then(async (userSnapshot) => {
                  console.log(userSnapshot, "usersnapshot");
                  const userCollectionRef = collection(db, "users");
                  if (userSnapshot.docs[0].exists()) {
                    const userData = userSnapshot.docs[0].data();
                    const enrolledCourses = userData?.enrolledCourses || [];
                    enrolledCourses.push(response.id);

                    const userDocRef = doc(
                      userCollectionRef,
                      userSnapshot.docs[0].id
                    );
                    await updateDoc(userDocRef, { enrolledCourses })
                      .then((res) => {
                        const enrolledCoursesPromises = enrolledCourses.map(
                          async (courseId: string) => {
                            const courseDoc = doc(db, "courses", courseId);
                            const courseSnapshot = await getDoc(courseDoc);
                            return courseSnapshot.data();
                          }
                        );
                        Promise.all(enrolledCoursesPromises).then(
                          async (enrolledCourses: any) => {
                            console.log("enrolled courses", enrolledCourses);
                            setEnrolledCoursesData(enrolledCourses);
                            const courseDoc = doc(db, "courses", response.id);
                            await getDoc(courseDoc)
                              .then((res) => {
                                console.log("yes o");
                                navigation.navigate("CourseDetails", {
                                  screen: "Classes",
                                  params: res.data(),
                                });
                                setTimeout(() => {
                                  navigation.pop();
                                  console.log("doneeee ");
                                }, 4000);
                                setIsLoading(false);
                              })
                              .catch((error) => {
                                console.log(error);
                                console.log("say error");
                                setIsLoading(false);
                              });
                          }
                        );
                      })
                      .catch((e) => {
                        setIsLoading(false);
                        console.log(e);
                        Alert.alert("Error updating doc, try again later");
                      });
                  }
                })
                .catch((error) => {
                  setIsLoading(false);
                  Alert.alert("Something unexpected happened");
                  console.log(error);
                });
            })
            .catch((e) => {
              Alert.alert("Something unexpected happened, try again later");
              setIsLoading(false);
              console.log(e);
            });
        })
        .catch((e) =>
          Alert.alert("Something unexpected happeneddd. Try again later")
        );
    } catch (e) {
      setIsLoading(false);
      Alert.alert("Something unexpected happenedd. Try again later.");
    }
  };

  useEffect(() => {
    console.log("class location changed to ", classLocation);
  }, [classLocation]);
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
      <View style={styles.inputContainer}>
        <InputField
          keyboardType="default"
          secure={false}
          placeholder="Course Code"
          placeholderTextColor="gray"
          value={courseCode}
          setValue={handleCourseCodeChange}
        />
      </View>
      {/* <View style={[styles.inputContainer, styles.marginVertical]}>
        <InputField
          placeholder="Class Location"
          placeholderTextColor="gray"
          secure={false}
          keyboardType="default"
          value={classLocationSearch}
          setValue={handleClassLocChange}
        />
        {!(isPlacesLoading || isItemSelected) && (
          <FlatList
            data={places}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  setClassLocation(item);
                  setClassLocationSearch(
                    item.name.split(",").slice(0, 2).join(",")
                  );
                  setIsItemSelected(true);
                }}
                style={[
                  {
                    backgroundColor: theme === "light" ? "#fff" : "#121212",
                    padding: 10,
                  },
                ]}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item: any) => item.id.toString()}
          />
        )}
        {isPlacesLoading && (
          <View
            style={[
              {
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              },
            ]}
          >
            <Text>Loading...</Text>
          </View>
        )}
      </View>
      <View style={[styles.inputContainer, styles.marginVertical]}></View> */}
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
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 0.5,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "red",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "white",
  },
  itemContainerStyle: {
    borderWidth: 1,
    color: "white",
  },
  containerStyle: {
    backgroundColor: "#000",
  },
  itemTextStyle: {
    color: "white",
    padding: 4,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    color: "#000",
    borderBottomColor: "gray",
  },
});
