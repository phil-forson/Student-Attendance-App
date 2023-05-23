import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  DatePickerIOSComponent,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function CreateClass({ navigation }: any) {
  const [classTitle, setClassTitle] = useState("");
  const [classStartTime, setClassStartTime] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classDate, setClassDate] = useState(new Date(Date.now()));
  const [classTime, setClassTime] = useState(new Date(Date.now()));
  const [showDate, setShowDate] = useState(false);

  const [platform, setPlatform] = useState("");

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setClassDate(currentDate ?? new Date(Date.now()));
  };

  const toggleShowDate = () => {
    setShowDate(!showDate);
  };
  // const openDateTime = () => {
  //   if(Platform.OS === "android"){
  //     setPlatform("android")
  //     DateTimePickerAndroid.open({
  //         value: classDate,
  //         onChange,
  //         mode: "date",
  //         is24Hour: true,
  //       })
  //   }
  //   else if(Platform.OS === 'ios'){
  //     setPlatform("ios")
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
            disabled={!(classTitle.length && classLocation.length)}
          >
            <Text
              style={{
                color: !(classTitle.length && classLocation.length)
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
  }, [classTitle, classLocation]);

  const handleClassTitleChange = (title: string) => {
    setClassTitle(title);
  };

  const handleClassStartTime = (time: string) => {
    setClassStartTime(time);
  };

  const handleClassLoc = (loc: string) => {
    setClassLocation(loc);
  };

  const createClass = () => {
    console.log(classLocation);
    navigation.goBack();
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
          keyboardType="default"
          secure={false}
          placeholder="Class location"
          placeholderTextColor="gray"
          value={classLocation}
          setValue={handleClassLoc}
        />
        <View style={[styles.inputContainer, styles.marginVertical]}>
          <InputField
            keyboardType="default"
            secure={false}
            placeholder="Class date"
            placeholderTextColor="gray"
            value={classDate.toLocaleDateString()}
            setValue={onChangeDate}
            editable={false}
            onClick={toggleShowDate}
          />
        </View>
        {showDate && Platform.OS === "ios" && (
          <DatePickerIOSComponent
            mode="datetime"
            onDateChange={(newDate: Date) => console.log(newDate)}
          />
        )}
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
