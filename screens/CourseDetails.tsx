import { View, Text, InvTouchableOpacity } from "../components/Themed";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IClassDetails, ICourseDetails } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  useWindowDimensions,
  Platform,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import ClassCard from "../components/ClassCard";

export const PASTCLASSES = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    className: "Lecture 1",
    duration: "3",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    className: "Lecture 2",
    duration: "3",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    className: "Lecture 3",
    duration: "1",
  },
];

export default function CourseDetails({ navigation, route }: any) {
  const course: ICourseDetails = route.params;
  const theme = useColorScheme();
  const nav = useNavigation<"Drawer">();
  const [classTab, setClassTab] = useState("upcoming");

  const handleTabSwitch = (value: string) => {
    setClassTab(value);
  };

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
      <ScrollView>
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
        {/* <View style={[styles.center]}>
      </View> */}
        <View style={[styles.marginTop]}>
          <View
            style={[{ flexDirection: "row", justifyContent: "space-between" }]}
          >
            <Text style={[styles.bold]}>Upcoming Class</Text>
            <InvTouchableOpacity>
              <Text style={[{ color: "#2f95dc" }]}>View All</Text>
            </InvTouchableOpacity>
          </View>
          <View
            style={[
              styles.card,
              styles.extraMarginTop,
              {
                justifyContent: "space-between",
                borderColor: theme === "light" ? "#737171" : "#fff",
                backgroundColor: theme === "light" ? "#fff" : "#121212",
              },
            ]}
          >
            <View style={[styles.transparentBg]}>
              <Text style={[styles.bold]}>Interface Design</Text>
            </View>
            <View style={[styles.transparentBg]}>
              <Text style={[styles.bold, styles.largeText]}>
                UI/UX Prototyping
              </Text>
            </View>
            <View style={[styles.transparentBg]}>
              <Text style={[styles.smallText]}>Duration: 2hrs</Text>
            </View>
          </View>
        </View>
        <View style={[{ marginTop: 50}]}>
          <View
            style={[{ flexDirection: "row", justifyContent: "space-between" }]}
          >
            <Text style={[styles.bold]}>Past Classes</Text>
            <InvTouchableOpacity>
              <Text style={[{ color: "#2f95dc" }]}>View All</Text>
            </InvTouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.pastClassesContainer]}
            data={PASTCLASSES}
            renderItem={({ item }) => (
              <ClassCard classSection={item} navigation={navigation} />
            )}
            keyExtractor={(course) => course.id}
            ItemSeparatorComponent={() => (
              <View style={[{ paddingRight: 30 }]}></View>
            )}
          />
        </View>
      </ScrollView>
      <InvTouchableOpacity
      onPress={() => navigation.navigate('CreateClass')}
        style={[
          styles.bottom,
          styles.circle,
          styles.shadow,
          {
            shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
            marginBottom: Platform.OS === "ios" ? 0 : 10,
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
  marginTop: {
    marginTop: 8,
  },
  extraMarginTop: {
    marginTop: 15,
  },
  header: {
    marginVertical: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
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
    padding: 15,
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
