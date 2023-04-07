import { StyleSheet } from "react-native";
import React from "react";
import { ICourseDetails } from "../types";
import { Text, View } from "./Themed";
import useColorScheme from "../hooks/useColorScheme";

export default function CourseCard({ data }: { data: ICourseDetails }) {
  const theme = useColorScheme();
  return (
    <View style={[styles.container]}>
      <View style={[styles.outside, styles.transparent]}>
        <Text style={[styles.courseName]}>{data.courseName}</Text>
      </View>
      <View style={[styles.outside, styles.transparent]}>
        <Text style={[styles.ownerName]}>{data.ownerName}</Text>
      </View>
      <View style={{ position: "relative", backgroundColor: "transparent" }}>
        <View style={[styles.bigCircle]}>
          <View style={[styles.smallCircle]}>
            <View style={[styles.smallerCircle]}></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#314cc5",
    height: 150,
    borderRadius: 10,
    flex: 1,
    padding: 19,
    overflow: "hidden",
  },
  bigCircle: {
    zIndex: -200,
    borderRadius: 150,
    backgroundColor: "transparent",
    width: 250,
    height: 250,
    position: "absolute",
    left: 200,
    bottom: -78,
    padding: 10,
    borderWidth: 40,
    borderColor: "#031b87",
    opacity: 1.5
  },
  smallCircle: {
    borderRadius: 100,
    backgroundColor: "transparent",
    width: 150,
    height: 150,
    position: "relative",
    borderWidth: 25,
    borderColor: "#031b87",
    padding: 10,
    opacity: 0.7
  },
  smallerCircle: {
    borderRadius: 100,
    backgroundColor: "transparent",
    width: 80,
    height: 80,
    position: "relative",
    borderWidth: 15,
    borderColor: "#0626b5",
    opacity: 0.6
  },
  outside: {
    zIndex: 100
  }, 
  transparent: {
    backgroundColor: 'transparent'
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  ownerName: {
    // marginTop: 20
    color: 'white'
  }
});
