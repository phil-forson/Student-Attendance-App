import { InputField } from "../components/InputField";
import {
  View,
  Text,
  TouchableOpacity,
  InvTouchableOpacity,
} from "../components/Themed";
import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { FlatList, Alert, ScrollView } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import useColorScheme from "../hooks/useColorScheme";
import axios from "axios";
import { CourseContext } from "../contexts/CourseContext";
import { Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import uuid from "react-native-uuid";
import { ClassContext } from "../contexts/ClassContext";
import StyledInput from "../components/StyledInput";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import {
  add30MinutesToTime,
  addOneHourFifyMinutesToTime,
  convertToDayString,
  convertToHHMM,
  generateUid,
  isStartTimeGreater,
  subtract30MinutesFromTime,
  subtractOneHourFiftyMinutesToTime,
} from "../utils/utils";
import { createClassInCourse } from "../utils/helpers";
import { IClass } from "../types";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { SelectList } from "react-native-dropdown-select-list";

export default function CreateClass({ navigation, route }: any) {
  const [classTitle, setClassTitle] = useState("");
  const [courseClassesIds, setCourseClassesIds] = useState([]);
  const [classStartTime, setClassStartTime] = useState<Date | null>(null);
  const [classEndTime, setClassEndTime] = useState<Date | null>(null);
  const [classStartTimeError, setClassStartTimeError] =
    useState<boolean>(false);
  const [classEndTimeError, setClassEndTimeError] = useState<boolean>(false);
  const [classLocation, setClassLocation] = useState<GooglePlaceData>();
  const [classLocationSearch, setClassLocationSearch] = useState<string>("");
  const [classLocationDetails, setClassLocationDetails] = useState<any>();

  const [dayOfTheWeek, setDayOfTheWeek] = useState("");

  const [googlePlacesInputFocused, setGooglePlacesInputFocused] =
    useState(false);
  const [showTime, setShowTime] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);

  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const { course } = useContext(CourseContext);

  const { setCourseClassesData } = useContext(ClassContext);

  const theme = useColorScheme();

  const daysOfTheWeek = [
    { key: "1", value: "Every Sunday" },
    { key: "2", value: "Every Monday" },
    { key: "3", value: "Every Tuesday" },
    { key: "4", value: "Every Wednesday" },
    { key: "5", value: "Every Thursday" },
    { key: "6", value: "Every Friday" },
    { key: "7", value: "Every Saturday" },
  ];
  useLayoutEffect(() => {
    console.log(route.params);
  }, []);

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleConfirmStartTime = (time: Date) => {
    const newDate = new Date(Date.now());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    if (!classEndTime) {
      const suggestedEndTime = addOneHourFifyMinutesToTime(newDate);
      setClassEndTime(suggestedEndTime);
    }

    if (
      !isStartTimeGreater(
        newDate,
        classEndTime ? classEndTime : new Date(newDate.getTime() + 1)
      )
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
    const newDate = new Date(Date.now());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    if (!classStartTime) {
      const suggestedStartTime = subtractOneHourFiftyMinutesToTime(newDate);
      setClassStartTime(suggestedStartTime);
    }

    if (
      !isStartTimeGreater(
        classStartTime ?? new Date(newDate.getTime() - 1),
        newDate
      )
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

  const handleClassTitleChange = (title: string) => {
    setClassTitle(title);
  };

  const createClass = async () => {
    setIsLoading(true);
    if (
      !(
        classStartTime &&
        classEndTime &&
        classStartTime !== null &&
        classEndTime !== null
      )
    ) {
      setIsLoading(false);
      return;
    }

    const startDate = new Date(route.params.courseDateFrom.toDate());
    const endDate = new Date(route.params.courseDateTo.toDate());

    const classTime = new Date(startDate); // Initialize classTime with the start date

    const selectedDay = dayOfTheWeek.slice(6);
    console.log("selected day ", selectedDay);

    let classes = [];
    let lectureNumber = 1;

    try {
      while (classTime <= endDate) {
        if (
          classTime.getDay() ===
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].indexOf(selectedDay)
        ) {
          // Set class time and other details
          classTime.setHours(
            parseInt(convertToHHMM(classStartTime).split(":")[0])
          );
          classTime.setMinutes(
            parseInt(convertToHHMM(classStartTime).split(":")[1])
          );
          classTime.setSeconds(0);

          const lectureTitle = `Lecture ${lectureNumber}`; // Generate class title

          // Prepare class document for Firestore
          const uid = generateUid();
          const data: IClass = {
            uid: uid.toString(),
            classTitle: lectureTitle,
            courseId: route.params.uid,
            courseTitle: route.params.courseTitle,
            classLocation: classLocation,
            classLocationDetails: classLocationDetails,
            classStartTime: Timestamp.fromDate(classStartTime),
            classEndTime: Timestamp.fromDate(classEndTime),
            classDate: Timestamp.fromDate(new Date(classTime)),
          };

          await createClassInCourse(route.params.uid, data);

          classes.push(data);
          lectureNumber++;
        }
        classTime.setDate(classTime.getDate() + 1); // Move to the next day
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownItemPressed = (item: any) => {
    setClassLocation(item);
    setClassLocationSearch(item?.name?.split(",").slice(0, 2).join(","));
    setIsItemSelected(true);
  };

  const autoCompleteRef = useRef(null);

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
              !(
                classLocationSearch.length &&
                classStartTime?.toLocaleString().length &&
                classEndTime?.toLocaleString().length
              ) ||
              isLoading ||
              !isItemSelected ||
              classStartTimeError ||
              classEndTimeError
            }
          >
            <Text
              style={{
                color:
                  !(
                    classLocationSearch.length &&
                    classStartTime?.toLocaleString().length &&
                    classEndTime?.toLocaleString().length
                  ) ||
                  isLoading ||
                  !isItemSelected ||
                  classStartTimeError ||
                  classEndTimeError
                    ? "#023f65"
                    : Colors.mainPurple,
                opacity:
                  !(
                    classLocationSearch.length &&
                    classStartTime &&
                    classEndTime
                  ) ||
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
    classLocation,
    classLocationDetails,
    classStartTime,
    classEndTime,
    isLoading,
    isItemSelected,
    classStartTimeError,
    classEndTimeError,
  ]);

  return (
    <View style={[styles.container, styles.contentContainer]}>
      <Text style={styles.mediumText}>
        Enter the following details to create a recurring class
      </Text>
      {/* <View style={styles.mmy}>
        <StyledInput
          keyboardType="default"
          secure={false}
          placeholder="Class Title eg. Full Class"
          placeholderTextColor="gray"
          value={classTitle}
          setValue={handleClassTitleChange}
        />
      </View> */}
      <View
        style={[
          styles.mmy,
          { paddingBottom: googlePlacesInputFocused ? 260 : 50 },
        ]}
      >
        <GooglePlacesAutocomplete
          placeholder="Search Class Location"
          onPress={(data, details = null) => {
            setIsItemSelected(true);
            setClassLocation(data);
            setClassLocationDetails(details?.geometry);
            setClassLocationSearch(data.description);
            // setClassLocation(data)
          }}
          ref={autoCompleteRef}
          query={{
            key: "AIzaSyAjJSMzeqfZBuoqAdx3bpAmezoIfGK5n1E",
            language: "en", // language of the results
          }}
          listEmptyComponent={() => (
            <View
              style={[
                styles.transBg,
                styles.justifyCenter,
                styles.itemsCenter,
                { height: 400 },
              ]}
            >
              <Text>No places available</Text>
            </View>
          )}
          styles={{
            textInput: [
              styles.transBg,
              {
                height: 50,
                backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
                color: theme === "dark" ? "white" : "black",
                paddingHorizontal: 20,
              },
            ],
            container: [styles.autocompleteContainer],
            listView: [
              styles.listView,
              {
                backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
                color: theme === "dark" ? "white" : "black",
              },
            ],
          }}
          textInputProps={{
            onFocus: () => setGooglePlacesInputFocused(true),
            onBlur: () => setGooglePlacesInputFocused(false),
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
        />
      </View>

      <View style={[styles.mmy]}>
        <SelectList
          placeholder="Enter day of the week. eg. Every Sunday"
          searchPlaceholder="Day of the week"
          boxStyles={{
            backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
            borderWidth: dayOfTheWeek ? 1 : 0,
            borderColor: theme === "dark" ? "#000" : "#fff",
            borderRadius: 4,
            height: 50,
            paddingHorizontal: 20,
            alignItems: "center",
          }}
          inputStyles={{
            color:
              theme === "dark"
                ? dayOfTheWeek
                  ? "white"
                  : "gray"
                : dayOfTheWeek
                ? "black"
                : "gray",
          }}
          dropdownStyles={{
            borderColor: theme === "dark" ? "#000" : "#fff",
            backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
            paddingHorizontal: 5,
          }}
          dropdownItemStyles={{
            padding: 10,
            height: 55,
            justifyContent: "center",
            borderBottomWidth: 0.19,
            borderBottomColor:
              theme === "dark" ? Colors.light.primaryGrey : "#fff",
          }}
          setSelected={(val: string) => setDayOfTheWeek(val)}
          data={daysOfTheWeek}
          save="value"
        />
      </View>
      <View style={[styles.mmy]}>
        <InvTouchableOpacity
          style={[
            {
              borderColor: !classStartTimeError
                ? theme === "dark"
                  ? "#000"
                  : "#fff"
                : "red",
              backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
              borderWidth: classStartTimeError || classStartTime ? 1 : 0,
              height: 50,
              paddingHorizontal: 20,
              borderRadius: 4,
              paddingVertical: 12,
            },
            styles.justifyCenter,
          ]}
          onPress={showStartTimePicker}
        >
          <Text
            style={{
              color:
                theme === "dark"
                  ? classStartTime
                    ? "white"
                    : "gray"
                  : classStartTime
                  ? "black"
                  : "gray",
              fontSize: 13.8,
            }}
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
      <View style={[styles.mmy]}>
        <InvTouchableOpacity
          style={[
            {
              borderColor: !classEndTimeError
                ? theme === "dark"
                  ? "#000"
                  : "#fff"
                : "red",
              backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
              borderWidth: classEndTimeError || classEndTime ? 1 : 0,
              height: 50,
              paddingHorizontal: 20,
              borderRadius: 4,
              paddingVertical: 12,
            },
            styles.justifyCenter,
          ]}
          onPress={showEndTimePicker}
        >
          <Text
            style={{
              color:
                theme === "dark"
                  ? classEndTime
                    ? "white"
                    : "gray"
                  : classEndTime
                  ? "black"
                  : "gray",
              fontSize: 13.8,
            }}
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
