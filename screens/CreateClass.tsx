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
  Alert,
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
  const [classStartTime, setClassStartTime] = useState<Date | null>(null);
  const [classEndTime, setClassEndTime] = useState<Date | null>(null);
  const [classStartTimeError, setClassStartTimeError] =
    useState<boolean>(false);
  const [classEndTimeError, setClassEndTimeError] = useState<boolean>(false);
  const [classLocation, setClassLocation] = useState("");
  const [classLocationSearch, setClassLocationSearch] = useState<string>("");
  const [classDate, setClassDate] = useState<Date>();
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const { course } = useContext(CourseContext);

  const { setCourseClassesData } = useContext(ClassContext);

  const theme = useColorScheme();

  const showDatePicker = () => {
    console.log("opening modal");
    setDatePickerVisibility(true);
  };

  const showStartTimePicker = () => {
    if (!classDate) {
      Alert.alert("Select class date before proceeding");
      return;
    }
    setStartTimePickerVisibility(true);
  };

  const showEndTimePicker = () => {
    if (!classDate) {
      Alert.alert("Select class date before proceeding");
      return;
    }
    if (!classStartTime) {
      Alert.alert("Select class start time before proceeding");
      return;
    }
    setEndTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    const classDate = new Date(date);
    console.log(classDate);
    setClassDate(classDate);
    hideDatePicker();
  };

  const handleConfirmStartTime = (time: Date) => {
    if (!classDate) {
      Alert.alert("Select class date before proceeding");
      hideStartTimePicker();
      return;
    }
    const newDate = new Date(classDate ?? Date.now());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    if (
      newDate?.getTime() <
      (classEndTime ? classEndTime.getTime() : newDate?.getTime() + 1)
    ) {
      setClassStartTime(newDate);
      hideStartTimePicker();
      setClassStartTimeError(false);
    } else {

      setClassStartTime(null);
      setClassStartTimeError(true);
      hideStartTimePicker();
    }
  };

  const handleConfirmEndTime = (time: Date) => {
    const newDate = new Date(classDate ?? Date.now());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    if (
      newDate?.getTime() >
      (classStartTime ? classStartTime.getTime() : newDate?.getTime() - 1)
    ) {
      setClassEndTime(newDate);
      hideEndTimePicker();
      setClassEndTimeError(false);
    } else {
      setClassEndTime(null);
      setClassEndTimeError(true);
      hideEndTimePicker();
    }
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

  const handleClassTitleChange = (title: string) => {
    setClassTitle(title);
  };

  const createClass = async () => {
    setIsLoading(true);
    if (
      !(
        classDate &&
        classStartTime &&
        classEndTime &&
        classStartTime !== null &&
        classEndTime !== null
      )
    ) {
      console.log("nothing");
      console.log("class date", classDate);
      console.log(classStartTime);
      console.log(classEndTime);
      setIsLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, "classes"), {
        courseId: course.uid,
        className: classTitle,
        classId: uuid.v4(),
        classLocation: classLocation,
        classDate: classDate,
        classStartTime: classStartTime,
        classEndTime: classEndTime,
        classStatus: 'upcoming'
      })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        })
        .then(async (res: any) => {
          const classId = res.id;

          const courseQuery = query(collection(db, 'courses'), where('uid', '==', course.uid))
          await getDocs(courseQuery)
            .then(async (snapshot) => {
              const courseDocRef = snapshot.docs[0].ref;
              const courseDocData = snapshot.docs[0].data();

              const courseClasses = courseDocData?.courseClasses || [];
              courseClasses.push(classId);
              console.log("course classes ", courseClasses);
              await updateDoc(courseDocRef, {
                courseClasses: courseClasses,
              })
                .then((res) => {
                  console.log('response after updating ', res)
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
                      console.log('res from then ', res)
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
        });
    } catch (error) {
      console.log(error);
    }
    // navigation.goBack();
  };

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
              !(classTitle.length && classLocationSearch.length  && classDate?.toLocaleString().length && classStartTime?.toLocaleString().length && classEndTime?.toLocaleString().length) ||
              isLoading ||
              !isItemSelected ||
              classStartTimeError ||
              classEndTimeError
            }
          >
            <Text
              style={{
                color:
                  !(classTitle.length && classLocationSearch.length  && classDate?.toLocaleString().length && classStartTime?.toLocaleString().length && classEndTime?.toLocaleString().length) ||
                  isLoading ||
                  !isItemSelected ||
                  classStartTimeError ||
                  classEndTimeError
                    ? "#023f65"
                    : "#008be3",
                opacity:
                  !(classTitle.length && classLocationSearch.length && classDate && classStartTime && classEndTime) ||
                  isLoading ||
                  !isItemSelected ||
                  classStartTimeError ||
                  classEndTimeError
                    ? 0.32
                    : 1,
                fontSize: 16,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [
    classTitle,
    classLocation,
    classDate,
    classStartTime,
    classEndTime,
    isLoading,
    isItemSelected,
    classStartTimeError,
    classEndTimeError,
  ]);

  useEffect(() => {
    if (classStartTime) {
      const newDate = new Date(classDate || Date.now());
      newDate.setHours(classStartTime.getHours());
      newDate.setMinutes(classStartTime.getMinutes());
      setClassStartTime(newDate);
    }
    if (classEndTime) {
      const newDate = new Date(classDate || Date.now());
      newDate.setHours(classEndTime.getHours());
      newDate.setMinutes(classEndTime.getMinutes());
      setClassEndTime(newDate);
    }
  }, [classDate]);
  useEffect(() => {
    console.log("class date changed to ", classDate);
    console.log("class start time changed to ", classStartTime);
    console.log("class end time changed to ", classEndTime);
  }, [classDate, classStartTime, classEndTime]);

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
            {classDate
              ? classDate?.toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Class Date"}
          </Text>
        </InvTouchableOpacity>
      </View>
      <View style={[styles.inputContainer, styles.marginVertical]}>
        <InvTouchableOpacity
          style={{
            borderBottomColor: !classStartTimeError ? "#C7C7CD" : "red",
            borderBottomWidth: 1,
            borderRadius: 4,
            paddingVertical: 12,
          }}
          onPress={showStartTimePicker}
        >
          <Text
            style={{ color: classStartTime ? "white" : "gray", fontSize: 13.8 }}
          >
            {classStartTime
              ? classStartTime?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Class Start Time"}
          </Text>
        </InvTouchableOpacity>
        {classStartTimeError && (
          <Text style={{ color: "red", marginTop: 6, fontSize: 13 }}>
            Start time cannot be greater than end time
          </Text>
        )}
      </View>
      <View style={[styles.inputContainer, styles.marginVertical]}>
        <InvTouchableOpacity
          style={{
            borderBottomColor: !classEndTimeError ? "#C7C7CD" : "red",
            borderBottomWidth: 1,
            borderRadius: 4,
            paddingVertical: 12,
          }}
          onPress={showEndTimePicker}
        >
          <Text
            style={{ color: classEndTime ? "white" : "gray", fontSize: 13.8 }}
          >
            {classEndTime
              ? classEndTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Class End Time"}
          </Text>
        </InvTouchableOpacity>
        {classEndTimeError && (
          <Text style={{ color: "red", marginTop: 6, fontSize: 13 }}>
            End time cannot be less than start time
          </Text>
        )}
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={classDate ?? new Date(Date.now())}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        date={classStartTime ?? new Date(Date.now())}
        onConfirm={handleConfirmStartTime}
        onCancel={hideStartTimePicker}
      />
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        date={classEndTime ?? new Date(Date.now())}
        onConfirm={handleConfirmEndTime}
        onCancel={hideEndTimePicker}
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
