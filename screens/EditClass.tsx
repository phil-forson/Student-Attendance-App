import { InputField } from "../components/InputField";
import {
  View,
  Text,
  TouchableOpacity,
  InvTouchableOpacity,
} from "../components/Themed";
import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import { FlatList, Alert } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import useColorScheme from "../hooks/useColorScheme";
import axios from "axios";
import { CourseContext } from "../contexts/CourseContext";
import { Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import uuid from "react-native-uuid";
import StyledInput from "../components/StyledInput";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import {
  add30MinutesToTime,
  convertToDayString,
  generateUid,
  isStartTimeGreater,
  subtract30MinutesFromTime,
} from "../utils/utils";
import { createClassInCourse, updateClassDetails } from "../utils/helpers";
import { IClass } from "../types";
import useClass from "../hooks/useClass";

export default function EditClass({ navigation, route }: {navigation: any, route: any}) {
  const [classTitle, setClassTitle] = useState("");
  const [classStartTime, setClassStartTime] = useState<Date | null>(null);
  const [classEndTime, setClassEndTime] = useState<Date | null>(null);
  const [classStartTimeError, setClassStartTimeError] =
    useState<boolean>(false);
  const [classEndTimeError, setClassEndTimeError] = useState<boolean>(false);
  const [classLocation, setClassLocation] = useState("");
  const [classLocationSearch, setClassLocationSearch] = useState<string>("");
  const [classDate, setClassDate] = useState<Date>();
  const [places, setPlaces] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const theme = useColorScheme();

  // const { classData, isLoading: isClassDataLoading} = useClass(route.params)

  useLayoutEffect(() => {
    console.log('params ', route.params);
    const classData: IClass = route.params;
    console.log('logging class data ', classData)
        setClassTitle(classData?.classTitle)
        setClassLocation(classData.classLocation)
        setClassLocationSearch(classData?.classLocation.name.split(',').slice(0,2).join(','))
        setIsItemSelected(true)
        setClassDate(classData?.classDate.toDate())
        setClassStartTime(classData?.classStartTime.toDate())
        setClassEndTime(classData?.classEndTime.toDate())
  }, []);

 
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

  useEffect(() => {
    if (!(classStartTime && classEndTime)) {
      console.log("no update");
      return;
    }

    if (classDate) {
      handleConfirmEndTime(classEndTime);
      handleConfirmStartTime(classStartTime);
    }
  }, [classDate]);

  const handleConfirmStartTime = (time: Date) => {
    if (!classDate) {
      Alert.alert("Select class date before proceeding");
      hideStartTimePicker();
      return;
    }
    const newDate = new Date(classDate ?? Date.now());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    if (!classEndTime) {
      const suggestedEndTime = add30MinutesToTime(newDate);
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
    const newDate = new Date(classDate ?? Date.now());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    if (!classStartTime) {
      const suggestedStartTime = subtract30MinutesFromTime(newDate);
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
        .catch((e) => {
          setIsPlacesLoading(false);
          console.log("places error ", e);
        });
    } catch (error) {
      setIsPlacesLoading(false);
      // Handle error
      console.error(error);
    }
  };

  const handleClassTitleChange = (title: string) => {
    setClassTitle(title);
  };

  const editClass = async () => {
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
      setIsLoading(false);
      return;
    }

    console.log("yeyee");

    try {
      const data: IClass = {
        uid: route.params.uid,
        courseId: route.params.courseId,
        courseTitle: route.params.courseTitle,
        classTitle: classTitle,
        classLocation: classLocation,
        classDate: Timestamp.fromDate(classDate),
        classStartTime: Timestamp.fromDate(classStartTime),
        classEndTime: Timestamp.fromDate(classEndTime),
        classStatus: "upcoming",
      };

      console.log('data ', data)
      await updateClassDetails(route.params.uid, data)
      //   await createClassInCourse(route.params.uid, data);
      navigation.goBack();
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => editClass()}
            style={{}}
            disabled={
              !(
                classTitle.length &&
                classLocationSearch.length &&
                classDate?.toLocaleString().length &&
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
                    classTitle.length &&
                    classLocationSearch.length &&
                    classDate?.toLocaleString().length &&
                    classStartTime?.toLocaleString().length &&
                    classEndTime?.toLocaleString().length
                  ) ||
                  isLoading ||
                  !isItemSelected ||
                  classStartTimeError ||
                  classEndTimeError
                    ? "#023f65"
                    : "#008be3",
                opacity:
                  !(
                    classTitle.length &&
                    classLocationSearch.length &&
                    classDate &&
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
              Edit
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

  return (
    <View style={[styles.container, styles.contentContainer]}>
      <Text style={styles.mediumText}>
        Enter the following details to create a class
      </Text>
      <View style={styles.mmy}>
        <StyledInput
          keyboardType="default"
          secure={false}
          placeholder="Class Title eg. Lecture 1"
          placeholderTextColor="gray"
          value={classTitle}
          setValue={handleClassTitleChange}
        />
      </View>
      <View style={[styles.mmy]}>
        <StyledInput
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
                  handleDropdownItemPressed(item);
                }}
                darkColor={Colors.dark.secondaryGrey}
                lightColor={Colors.light.secondaryGrey}
                style={[
                  {
                    padding: 10,
                    height: 55,
                    justifyContent: "center",
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
      <View style={[styles.mmy]}>
        <InvTouchableOpacity
          style={[
            {
              backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
              borderWidth: classDate ? 1 : 0,
              borderColor: "#C7c7c7",
              borderRadius: 4,
              height: 50,
              paddingHorizontal: 20,
            },
            styles.justifyCenter,
          ]}
          onPress={showDatePicker}
        >
          <Text
            style={{
              color:
                theme === "dark"
                  ? classDate
                    ? "white"
                    : "gray"
                  : classDate
                  ? "black"
                  : "gray",
              fontSize: 13.8,
            }}
          >
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
      <View style={[styles.mmy]}>
        <InvTouchableOpacity
          style={[
            {
              borderColor: !classStartTimeError ? "#C7C7CD" : "red",
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
              borderColor: !classEndTimeError ? "#C7C7CD" : "red",
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
