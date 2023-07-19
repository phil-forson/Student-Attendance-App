import { View, Text } from "../components/Themed";
import { SafeAreaView, useColorScheme } from "react-native";
import React from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { RootStackScreenProps, UserStackScreenProps } from "../types";

export default function CourseDetails({
  navigation,
  route,
}: UserStackScreenProps<"CourseDetails">) {
  const theme = useColorScheme();
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark"
              ? Colors.dark.background
              : Colors.light.primaryGrey,
        },
      ]}
    >
      <View
        style={[styles.headerView]}
        darkColor={Colors.dark.background}
        lightColor={Colors.light.primaryGrey}
      >
        <View style={[styles.smy, styles.transBg]}>
          <Text
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={[styles.bold, styles.largeText]}
          >
            Attendance
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
