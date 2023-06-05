import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import { UserData, UserStackScreenProps } from "../types";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import useUser from "../hooks/useUser";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import SearchableDropdown from "react-native-searchable-dropdown";

export default function CreateCourse({ navigation }: any) {
  const { userDataPromise } = useUser();
  const theme = useColorScheme();

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
            disabled={
              !(
                courseTitle.length &&
                classLocationSearch.length &&
                courseCode.length
              ) ||
              isLoading ||
              !isItemSelected
            }
          >
            <Text
              style={{
                color:
                  !(
                    courseTitle.length &&
                    classLocationSearch.length &&
                    courseCode.length
                  ) ||
                  isLoading ||
                  !isItemSelected
                    ? "#0874b8"
                    : "#008be3",
                fontSize: 16,
                opacity:
                  !(
                    courseTitle.length &&
                    classLocationSearch.length &&
                    courseCode.length
                  ) ||
                  isLoading ||
                  !isItemSelected
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
  }, [courseTitle, classLocation, courseCode, isLoading, isItemSelected]);

  useEffect(() => {
    console.log("places changed to ", places);
  }, [places]);

  const handleCourseTitleChange = (title: string) => {
    setCourseTitle(title);
  };

  const handleCourseCodeChange = (title: string) => {
    setCourseCode(title);
  };

  const handleClassLocChange = async (loc: string) => {
    setIsItemSelected(false);
    setClassLocationSearch(loc);
    setIsPlacesLoading(true);
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${loc}&countrycodes=GH`;
    try {
      console.log("trying");
      await axios
        .get(apiUrl)
        .then((response) => {
          const data = response.data;
          console.log("data ", data);
          const placesData = data.map((location: any) => ({
            id: location.place_id,
            name: location.display_name,
            boundingBox: location.boundingbox,
          }));
          setPlaces(placesData);
          setIsPlacesLoading(false);
        })
        .catch((e) => console.log("places error ", e));
    } catch (error) {
      setIsPlacesLoading(false);
      // Handle error
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("is places loading changed to ", isPlacesLoading);
  }, [isPlacesLoading]);

  useEffect(() => {
    console.log(" item selection changed to ", isItemSelected);
  }, [isItemSelected]);

  const createCourse = async () => {
    setIsLoading(true);
    if (
      !(courseTitle.length && classLocationSearch.length) ||
      !isItemSelected
    ) {
      setIsLoading(false);
      return;
    }
    try {
      await userDataPromise.then(async (res: any) => {
        const classesCollectionRef = collection(db, "classes");

        await addDoc(classesCollectionRef, {
          courseTitle: courseTitle,
          lecturerName: res?.firstName + " " + res?.lastName,
          location: classLocation,
        })
          .then((response) => {
            navigation.navigate("Home");
            setIsLoading(false);
          })
          .catch((e) => {
            Alert.alert("Something unexpected happened, try again later");
            setIsLoading(false);
            console.log(e);
          });
      });
    } catch (e) {
      setIsLoading(false);
      Alert.alert("Something unexpected happened. Try again later.");
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
      <View style={[styles.inputContainer, styles.marginVertical]}>
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
                    backgroundColor: theme === "light" ? "#eee" : "#121212",
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
      <View style={[styles.inputContainer, styles.marginVertical]}></View>
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
