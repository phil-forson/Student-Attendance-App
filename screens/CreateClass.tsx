import { InputField } from "../components/InputField";
import {
  View,
  Text,
  TouchableOpacity,
  InvTouchableOpacity,
} from "../components/Themed";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  DatePickerIOSComponent,
  FlatList,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useColorScheme from "../hooks/useColorScheme";
import axios from "axios";
import { CourseContext } from "../contexts/CourseContext";
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
import uuid from "react-native-uuid";
import { ClassContext } from "../contexts/ClassContext";
import { StretchOutY } from "react-native-reanimated";

export default function CreateClass({ navigation }: any) {
  const [classTitle, setClassTitle] = useState("");
  const [classStartTime, setClassStartTime] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classLocationSearch, setClassLocationSearch] = useState<string>("");
  const [classDate, setClassDate] = useState<any>("");
  const [classTime, setClassTime] = useState(new Date(Date.now()));
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    console.log("opening modal");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    const classDate = new Date(date);
    console.log(classDate);
    setClassDate(classDate);
    hideDatePicker();
  };

  const [platform, setPlatform] = useState("");

  const { course } = useContext(CourseContext);

  const { setCourseClassesData } = useContext(ClassContext);

  const theme = useColorScheme();

  const onChangeDate = (selectedDate?: any) => {
    const classDate = selectedDate;
    setClassDate(classDate ?? new Date(Date.now()));
  };

  useEffect(() => {
    console.log("item selected changed to ", isItemSelected);
    console.log(isLoading, "isloading ");
    console.log(
      !(classTitle.length && classLocationSearch.length) ||
        isLoading ||
        !isItemSelected
    );
    console.log("class length ", classLocationSearch.length);
  }, [isItemSelected, isLoading]);

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

  // const openDate = () => {
  //   if (Platform.OS === "android") {
  //     setShowDate(false);
  //     DateTimePickerAndroid.open({
  //       value: classDate,
  //       onChange: onChangeDate,
  //       mode: "date",
  //       is24Hour: true,
  //     });
  //   } else if (Platform.OS === "ios") {
  //     setShowDate(true);
  //   }
  // };

  const width = Dimensions.get("screen").width - 40;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createClass()}
            style={{}}
            disabled={
              !(classTitle.length && classLocationSearch.length) ||
              isLoading ||
              !isItemSelected
            }
          >
            <Text
              style={{
                color:
                  !(classTitle.length && classLocationSearch.length) ||
                  isLoading ||
                  !isItemSelected
                    ? "#023f65"
                    : "#008be3",
                fontSize: 16,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [classTitle, classLocation, isLoading, isItemSelected]);

  const handleClassTitleChange = (title: string) => {
    setClassTitle(title);
  };

  const handleClassStartTime = (time: string) => {
    setClassStartTime(time);
  };

  const handleClassLoc = (loc: string) => {
    setClassLocation(loc);
  };

  const createClass = async () => {
    console.log("creating class...");
    console.log(classLocation);
    console.log(course);
    setIsLoading(true);
    try {
      const classRef = await addDoc(collection(db, "classes"), {
        courseId: course.uid,
        className: classTitle,
        classId: uuid.v4(),
        classLocation: classLocation,
        classDate: classDate,
      });

      const classId = classRef.id;

      const courseQuery = query(
        collection(db, "courses"),
        where("uid", "==", course.uid)
      );
      await getDocs(courseQuery)
        .then(async (snapshot) => {
          const courseDocRef = snapshot.docs[0].ref;
          const courseDocData = snapshot.docs[0].data();

          const courseClasses = courseDocData.courseClasses || [];
          courseClasses.push(classId);
          console.log("course classes ", courseClasses);
          await updateDoc(courseDocRef, {
            courseClasses: courseClasses,
          })
            .then((res) => {
              const courseClassesPromises = courseClasses.map(
                async (classId: string) => {
                  const classDoc = doc(db, "classes", classId);
                  const classSnapshot = await getDoc(classDoc);
                  return classSnapshot.data();
                }
              );

              Promise.all(courseClassesPromises)
                .then(async (courseClasses: any) => {
                  console.log("enrolled courses", courseClasses);
                  setCourseClassesData(courseClasses);
                })
                .then((res) => {
                  navigation.goBack();
                  setIsLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setIsLoading(false);
                });
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
    // navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Enter the following details to create a class
      </Text>
      <View style={styles.inputContainer}>
        <InputField
          keyboardType="default"
          secure={false}
          placeholder="Class Title eg. Lecture 1"
          placeholderTextColor="gray"
          value={classTitle}
          setValue={handleClassTitleChange}
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
      <View style={[styles.inputContainer, styles.marginVertical]}>
        {/* <InputField
          keyboardType="default"
          secure={false}
          placeholder="Class date"
          placeholderTextColor="gray"
          value={classDate?.toLocaleDateString()}
          setValue={onChangeDate}
          onClick={showDatePicker}
          editable={false}
          caretHidden={false}
        /> */}
        <InvTouchableOpacity
          style={{
            borderBottomColor: "#C7C7CD",
            borderBottomWidth: 1,
            borderRadius: 4,
            paddingVertical: 12,
          }}
          onPress={showDatePicker}
        >
          <Text style={{ color: classDate ? "white" : "gray", fontSize: 13.8 }}>
            {classDate ? classDate?.toLocaleDateString() : "Class date"}
          </Text>
        </InvTouchableOpacity>
      </View>
      {/* {showDate && Platform.OS === "ios" && (
        <DateTimePicker
          testID="dateTimePicker"
          value={classDate}
          mode={"date"}
          is24Hour={true}
          onChange={onChangeDate}
        />
      )} */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
