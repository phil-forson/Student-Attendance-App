import { useIsFocused } from "@react-navigation/native";
import { View, Text } from "../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { IClass, UserData } from "../types";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  AntDesign,
  Fontisto,
} from "@expo/vector-icons";
import { Platform } from "react-native";
import TimeProgressBar from "../components/TimeProgressBar";
import { Image } from "react-native";
import FullWidthButton from "../components/FullWidthButton";
import useUser from "../hooks/useUser";
import { CourseContext } from "../contexts/CourseContext";
import { ClassContext } from "../contexts/ClassContext";

export default function ClassDetails({ navigation, route }: any) {
  const theme = useColorScheme();
  const isFocused = useIsFocused();

  const { userDataPromise } = useUser();
  const { course } = useContext(CourseContext);
  const { courseClass } = useContext(ClassContext)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [classData, setClassData] = useState<IClass>();

  const getClassData = async () => {
    setIsLoading(true);
    setClassData(route.params);
    setIsLoading(false);
  };

  const clockIn = async () => {
    await userDataPromise.then(async (user: any) => {
      console.log({
        user: user,
        course: course,
        class: courseClass
      })
    })
  }

  const images = [
    require("../assets/profileimg.png"),
    require("../assets/profileimg.png"),
    require("../assets/profileimg.png"),
  ];
  useEffect(() => {
    if (isFocused) {
      getClassData();
    }
    console.log("navigation route ", route.params);
  }, [isFocused, route]);

  if (isLoading) {
    return <Text style={styles.center}>Loading...</Text>;
  }
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#121212" : "#eee",
          paddingTop: Platform.OS === "ios" ? 0 : 30,
        },
      ]}
    >
      <View style={[{ paddingHorizontal: 20, flex: 1 ,justifyContent: 'space-between', paddingVertical: 10}]}>
        <View style={[{}]}>
          <View style={[styles.marginTop, styles.header]}>
            <Text style={[styles.bold, styles.largeText]}>
              {classData?.className}
            </Text>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={theme === "dark" ? "white" : "black"}
            />
          </View>
          <View
            style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter]}
          >
            <Text style={[styles.bold, styles.extraLarge]}>
              {classData?.classStartTime &&
                new Date(
                  classData?.classStartTime?.toDate()
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
              to{" "}
              {classData?.classEndTime &&
                new Date(classData?.classEndTime?.toDate()).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
            </Text>
            <FontAwesome5 name="greater-than" size={24} color="#007bff" />
          </View>
          <View
            style={[styles.flexRow, styles.itemsCenter, styles.extraMarginTop]}
          >
            <View
              style={[styles.circle, styles.marginTop]}
              darkColor="#000"
              lightColor="#fff"
            >
              <Ionicons
                name="location"
                size={20}
                color={theme === "dark" ? "white" : "black"}
              />
            </View>
            <Text style={[{ paddingLeft: 10 }, styles.mediumText]}>
              {classData?.classLocation.name.split(",").slice(0, 2).join(",")
                .length <= 32
                ? classData?.classLocation.name.split(",").slice(0, 2).join(",")
                : classData?.classLocation.name
                    .split(",")
                    .slice(0, 2)
                    .join(",")
                    .slice(0, 32) + "..."}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.itemsCenter,
              styles.extraMarginTop,
            ]}
          >
            <View
              style={[styles.circle, styles.marginTop]}
              darkColor="#000"
              lightColor="#fff"
            >
              <Fontisto
                name="date"
                size={20}
                color={theme === "dark" ? "white" : "black"}
              />
            </View>
            <Text style={[{ paddingLeft: 10 }, styles.mediumText]}>
              {classData?.classDate &&
                new Date(classData?.classDate.toDate()).toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.itemsCenter,
              styles.extraMarginTop,
              styles.borderBottom,
              styles.paddingBottom,
              { borderBottomColor: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            <View
              style={[styles.circle, styles.marginTop]}
              darkColor="#000"
              lightColor="#fff"
            >
              <Ionicons
                name="md-book"
                size={20}
                color={theme === "dark" ? "white" : "black"}
              />
            </View>
            <Text style={[{ paddingLeft: 10 }, styles.mediumText]}>
              {course.courseTitle + " "} ({" " + course.courseCode + " " })
            </Text>
          </View>
          <View
            style={[
              styles.marginTop,
              styles.paddingBottom,
              styles.borderBottom,
              { borderBottomColor: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            <Text>Hello World</Text>
          </View>
          <View
            style={[
              styles.marginTop,
              styles.borderBottom,
              {
                paddingVertical: 10,
                borderBottomColor: theme === "dark" ? "#fff" : "#000",
              },
            ]}
          >
            <Text style={[styles.largeText]}>Clocked In</Text>
            <View
              style={[
                { flexDirection: "row", alignItems: "center" },
                styles.marginTop,
              ]}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={[styles.image, { marginLeft: index > 0 ? -40 : 0 }]}
                />
              ))}
              <View
                style={[
                  styles.image,
                  {
                    marginLeft: -40,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                darkColor="#20212C"
              >
                <Text style={[styles.bold, styles.mediumText]}>+53</Text>
              </View>
            </View>
            <Text style={[styles.marginTop, { paddingBottom: 10 }]}>
              Akosua, Akose, Akosu and 54 others are already clocked in
            </Text>
          </View>
        </View>
        <View>
          <FullWidthButton text="Clock In" onPress={clockIn} disabled={true}/>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  marginTop: {
    marginTop: 8,
  },
  extraMarginTop: {
    marginTop: 15,
  },
  paddingBottom: {
    paddingBottom: 35,
  },
  marginBottom: {
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: "row",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#eee",
  },
  itemsCenter: {
    alignItems: "center",
  },
  header: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
  },
  extraLarge: {
    fontSize: 30,
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
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  circle: {
    borderRadius: 50,
    padding: 12,
    width: "auto",
    alignItems: "center",
  },
  card: {
    height: 150,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 0.8,
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  transparentBg: {
    backgroundColor: "transparent",
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 20,
  },
  smallText: {
    fontSize: 12,
  },
  pastClassesContainer: {
    marginVertical: 10,
  },
});
