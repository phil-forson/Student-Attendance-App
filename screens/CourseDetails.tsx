import { View, Text, InvTouchableOpacity } from "../components/Themed";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ICourseDetails } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function CourseDetails({ navigation, route }: any) {
  const course: ICourseDetails = route.params;
  const theme = useColorScheme();
  const nav = useNavigation<"Drawer">();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#121212" : "#eee",
        },
      ]}
    >
      <View>
        <InvTouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </InvTouchableOpacity>
      </View>
      <View
        lightColor="#fff"
        darkColor="#0c0c0c"
        style={[styles.header, styles.shadow]}
      >
        <View lightColor="#fff" darkColor="#0c0c0c">
          <Text style={[styles.bold]}>
            {course.courseName.slice(0, 10) + "..."}
          </Text>
        </View>
        <View lightColor="#fff" darkColor="#0c0c0c">
          <Text style={[styles.bold]}>{course.lecturerName}</Text>
        </View>
      </View>
      <Text>CourseDetails</Text>
      <View style={[styles.center]}>
        {/* <Text>You have no upcoming classes, create a class</Text> */}

      </View>
      <InvTouchableOpacity
        style={[
          styles.bottom,
          styles.circle,
          styles.shadow,
          {
            shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
          },
        ]}
        darkColor="#0c0c0c"
        lightColor="#fff"
      >
        <AntDesign
          name="plus"
          color={"#007bff"}
          size={18}
          style={{ fontWeight: "bold" }}
        />
      </InvTouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginVertical: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bold: {
    fontWeight: "700",
    fontSize: 15,
  },
  shadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    marginBottom: 0,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  circle: {
    borderRadius: 50,
    padding: 15,
  },
});
