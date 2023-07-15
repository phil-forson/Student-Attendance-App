import { StyleSheet, SafeAreaView, useColorScheme } from "react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "../components/Themed";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import FullWidthButton from "../components/FullWidthButton";
import { RootStackScreenProps } from "../types";

export default function UserStatus({
  navigation,
  route,
}: RootStackScreenProps<"UserStatus">) {
  const theme = useColorScheme();
  const [userStatus, setUserStatus] = useState("");

  const handleContinue = () => {
    if (!userStatus) {
      return;
    }
    const data = {
      ...route.params,
      userStatus: userStatus,
    };

    console.log(data);

    navigation.navigate("AccountDetails", data);
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000" : "#fff" },
      ]}
    >
      <View style={[styles.subContainer]}>
        <View style={[styles.headerView]}>
          <Text style={[styles.headerMainText]}>User Status</Text>
          <Text style={[styles.headerSubText]}>
            To customize your experience, please specify whether you are a
            student or a teacher.
          </Text>
        </View>
        <View style={[]}>
          <TouchableOpacity
            style={[
              styles.selectCard,
              styles.my,
              {
                backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
                borderWidth: 1,
                borderColor:
                  userStatus === "Student"
                    ? theme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#000"
                    : "#fff",
              },
            ]}
            onPress={() => setUserStatus("Student")}
          >
            <View style={[{ backgroundColor: "transparent" }, styles.cardMain]}>
              <View style={[styles.circle, { backgroundColor: "orange" }]}>
                <Entypo name="graduation-cap" size={24} color="white" />
              </View>
              <Text style={[{ fontSize: 20, fontWeight: "600" }]}>Student</Text>
            </View>
            <Text style={[styles.cardText]}>
              As a student, you'll have access to course enrollment, assignment
              submissions, and grade tracking.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectCard,
              styles.my,
              {
                backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
                borderWidth: 1,
                borderColor:
                  userStatus === "Teacher"
                    ? theme === "dark"
                      ? "#fff"
                      : "#000"
                    : theme === "dark"
                    ? "#000"
                    : "#fff",
              },
            ]}
            onPress={() => setUserStatus("Teacher")}
          >
            <View style={[{ backgroundColor: "transparent" }, styles.cardMain]}>
              <View style={[styles.circle, { backgroundColor: "#42a9f9" }]}>
                <FontAwesome5
                  name="chalkboard-teacher"
                  size={24}
                  color="white"
                />
              </View>
              <Text style={[{ fontSize: 20, fontWeight: "600" }]}>Teacher</Text>
            </View>
            <Text style={[styles.cardText]}>
              As a teacher, you'll be able to create and manage courses, grade
              assignments, and communicate with students.
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.bottom]}>
          <FullWidthButton
            text={"Continue"}
            onPress={handleContinue}
            disabled={!userStatus}
            style={{ paddingHorizontal: 10 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    flex: 1,
  },
  headerView: {},
  headerMainText: {
    fontSize: 30,
    fontWeight: "700",
  },
  headerSubText: {
    marginTop: 10,
    fontSize: 16,
  },
  my: {
    marginVertical: 20,
  },
  selectCard: {
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  alignCenter: {
    alignItems: "center",
  },
  cardMain: {
    flexDirection: "column",
    gap: 10,
    paddingBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
  circle: {
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 0,
  },
});
