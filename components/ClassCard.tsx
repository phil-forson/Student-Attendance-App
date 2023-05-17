import useColorScheme from "../hooks/useColorScheme";
import { IClassDetails } from "../types";
import { View, Text, InvTouchableOpacity } from "./Themed";
import React from "react";
import { StyleSheet } from "react-native";

export default function ClassCard({
  classSection,
  navigation,
}: {
  classSection: IClassDetails;
  navigation: any;
}) {
  const theme = useColorScheme();
  return (
    <InvTouchableOpacity
      style={[
        styles.container,
        {
          borderColor: theme === "light" ? "#737171" : "#fff",
          backgroundColor: theme === "light" ? "#fff" : "#121212",
          justifyContent: 'space-around'
        },
      ]}
    >
      <Text>{classSection.className}</Text>
      <Text>{classSection.duration}hrs</Text>

    </InvTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    backgroundColor: "red",
    borderRadius: 10,
    borderWidth: 0.8,
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
});
