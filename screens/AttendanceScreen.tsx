import { ListRenderItem, SafeAreaView, useColorScheme } from "react-native";
import { View, Text } from "../components/Themed";
import React from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { convertToHHMM } from "../utils/utils";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import ClassCard from "../components/ClassCard";

const data: any[] = [
  {
    id: "1",
    courseName: "Agriculture",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    duration: "1h 50m",
    date: convertToHHMM(new Date(Date.now())),
  },
  {
    id: "2",
    courseName: "Physics",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    duration: "1h 50m",
    date: convertToHHMM(new Date(Date.now())),
  },
  {
    id: "3",
    courseName: "Chemistry",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    duration: "1h 50m",
    date: convertToHHMM(new Date(Date.now())),
  },
  {
    id: "4",
    courseName: "Mathematics",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    duration: "1h 50m",
    date: convertToHHMM(new Date(Date.now())),
  },
];

export default function AttendanceScreen({navigation}: any) {
  const theme = useColorScheme();

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return <ClassCard courseClass={item} navigation={navigation} />;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
      ]}
    >
      <View
        style={[styles.contentContainer]}
        darkColor={Colors.dark.background}
        lightColor={Colors.light.background}
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
      <View style={[styles.flexOne]}>
        <View
          lightColor={Colors.light.primaryGrey}
          darkColor={Colors.dark.primaryGrey}
          style={[
            { paddingHorizontal: 20, paddingVertical: 10 },
            styles.justifyCenter,
            styles.justifyBetween,
            styles.flexRow,
          ]}
        >
          <AntDesign name="left" color={theme === "dark" ? "white" : "black"} />
          <View style={[styles.transBg, styles.flexRow, styles.itemsCenter]}>
            <AntDesign
              name="calendar"
              color={theme === "dark" ? "white" : "black"}
              style={[{ paddingRight: 10 },]}
              size={15}
            />
            <Text style={[styles.bold]}>May 2022</Text>
          </View>
          <AntDesign
            name="right"
            color={theme === "dark" ? "white" : "black"}
          />
        </View>
        <View
          
          style={[
            styles.transBg,
            { paddingHorizontal: 20, paddingVertical: 10 },
            styles.justifyCenter,
            styles.justifyAround,
            styles.flexRow,
          ]}
        >
          <View><Text>2h worked</Text></View>
          <View><Text>8h worked</Text></View>
        </View>
        <View
          lightColor={Colors.light.secondaryGrey}
          darkColor={Colors.dark.secondaryGrey}
          style={[
            { paddingHorizontal: 20, paddingVertical: 10 },
            styles.justifyCenter,
            styles.justifyBetween,
            styles.flexRow,
          ]}
        >
          <View style={[styles.transBg]}><Text style={[styles.bold]}>Week 1</Text></View>
          <View style={[styles.transBg]}><Text>8h worked</Text></View>
        </View>
        <FlatList
          data={data}
          keyExtractor={(courseClass: an) => courseClass.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <CardSeparator viewStyle={[styles.transBg]} />
          )}
          contentContainerStyle={[styles.transBg, { paddingHorizontal: 20, paddingVertical: 20 }]}
        />
      </View>
    </SafeAreaView>
  );
}
