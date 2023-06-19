import { useIsFocused } from "@react-navigation/native";
import { View, Text } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { collection, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { IClass } from "../types";
import { Entypo, FontAwesome5, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function ClassDetails({ navigation, route }: any) {
  const theme = useColorScheme();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [classData, setClassData] = useState<IClass>();

  const getClassData = () => {
    setIsLoading(true);
    setClassData(route.params);
    setIsLoading(false);
  };

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
      <View style={[{ paddingHorizontal: 20 }]}>
        <View style={[styles.marginTop, styles.header]}>
          <Text style={[styles.bold, styles.largeText]}>{classData?.className}</Text>
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
              new Date(classData?.classStartTime?.toDate()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}{" "}
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
          style={[styles.flexRow, styles.itemsCenter, styles.extraMarginTop]}
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
            {classData?.classDate && new Date(classData?.classDate.toDate()).toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop: {
    marginTop: 8,
  },
  extraMarginTop: {
    marginTop: 15,
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
