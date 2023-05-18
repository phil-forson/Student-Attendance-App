import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, KeyboardAvoidingView, Dimensions } from "react-native";
import DatePicker from 'react-native-datepicker'

export default function CreateClass({ navigation }: any) {
  const [classTitle, setClassTitle] = useState("");
  const [classStartTime, setClassStartTime] = useState("");
  const [classLocation, setClassLocation] = useState("");

  const width = Dimensions.get('screen').width - 40

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={() => createClass()}
            style={{}}
            disabled={!(classTitle.length && classLocation.length) }
          >
            <Text
              style={{
                color: !(classTitle.length && classLocation.length)? "#023f65" : "#008be3",
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
    navigation.goBack()
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
      {/* <DatePicker
        style={{width: width}}
        date={classStartTime}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="2016-05-01"
        maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        // customStyles={{
        //   dateIcon: {
        //     position: 'absolute',
        //     left: 0,
        //     top: 4,
        //     marginLeft: 0
        //   },
        //   dateInput: {
        //     marginLeft: 36
        //   }
        //   // ... You can check the source to find the other keys.
        // }}
        onDateChange={(date) => {setClassStartTime(date)}}
      /> */}
      </View>
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
