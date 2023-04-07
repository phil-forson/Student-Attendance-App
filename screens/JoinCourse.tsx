import { InputField } from "../components/InputField";
import { View, Text, TouchableOpacity, InvTouchableOpacity } from "../components/Themed";
import React, { useEffect, useState , useLayoutEffect} from "react";
import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";

export default function JoinCourse({ navigation }: any) {
  const theme = useColorScheme();
  const [courseCode, setCourseCode] = useState("");

  const handleCodeChange = (code: string) => {
    console.log(code);
    setCourseCode(code);
    console.log("working");
    console.log(courseCode)
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#121212"
            onPress={joinCourse}
            style={{}}
            disabled={courseCode.length === 0}
          >
            <Text
              style={{
                color: courseCode.length == 0 ? "#023f65" : "#008be3",
                fontSize: 16,
              }}
            >
              Join
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [courseCode]);

  const joinCourse = () => {
    console.log(courseCode);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bigFont}>
          Enter the code for the course group you'd like to join.
        </Text>
        <View style={styles.inputContainer}>
          <InputField
            keyboardType="default"
            secure={false}
            placeholder="Code"
            placeholderTextColor="gray"
            value={courseCode}
            setValue={handleCodeChange}
          />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme === "dark" ? "#232323" : "#f4efef",
            marginBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={[
              styles.instructionsHeader,
              {
                borderBottomWidth: 1,
                borderBottomColor: theme === "dark" ? "#232323" : "#f4efef",
              },
            ]}
          >
            Instructions
          </Text>
        </View>
        <Text style={styles.info}>
          Ask your lecturer for the course code which would be available to him
          and then you can enter it here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingVertical: 30,
  },
  inputContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  bigFont: {
    fontSize: 15,
    paddingHorizontal: 20,
  },
  instructions: {
    // color: 'blue',
    fontSize: 15,
    paddingHorizontal: 20,
  },
  instructionsHeader: {
    marginTop: 10,
    fontWeight: "500",
    paddingVertical: 5,
    fontSize: 16,
    color: "#0083eb",
  },
  info: {
    fontWeight: "500",
    paddingHorizontal: 20,
  },
});
