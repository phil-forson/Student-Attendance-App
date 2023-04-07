import { InputField } from "../components/InputField";
import { View, Text } from "../components/Themed";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function JoinCourse() {
  const [courseCode, setCourseCode] = useState("");
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bigFont}>
          Enter the code for the course group you'd like to join. The code is
          available to the creator of the group.{" "}
        </Text>
        <View style={styles.inputContainer}>
          <InputField
            keyboardType="default"
            secure={false}
            placeholder="Class Code"
            placeholderTextColor="gray"
            valid={true}
            value={courseCode}
            setValue={setCourseCode}
          />
        </View>
        <Text style={styles.instructionsHeader}>Instructions</Text>
        <Text style={styles.instructions}>
          Ask your lecturer for the course code which would be available to him
          and then you can enter it here.
        </Text>
        <Text style={styles.info}>
          The course code contains about 6-8 digits including numbers and
          alphabets
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  inputContainer: {
    marginVertical: 15,
  },
  bigFont: {
    fontSize: 17,
  },
  instructions: {
    // color: 'blue',
    fontSize: 15,
  },
  instructionsHeader: {
    marginTop: 10,
    fontWeight: "500",
    paddingVertical: 5,
    fontSize: 16,
  },
  info: {
    marginTop: 20,
    fontWeight: "500",
  },
});
