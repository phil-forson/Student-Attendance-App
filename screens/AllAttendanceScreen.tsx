import { View, Text, ListRenderItem, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "../styles/styles";
import UserAttendanceCard from "../components/UserAttendanceCard";
import Colors from "../constants/Colors";
import { secondsToHHMMSS } from "../utils/utils";

export default function AllAttendanceScreen({ navigation, route }: any) {
  const theme = useColorScheme();

  const { rankedStudentsAttendance, totalClassTime } = route.params;
  useEffect(() => {
    console.log("route params ", route.params);
  }, []);

  const renderRankedStudentItem: ListRenderItem<any> = ({ item }) => {
    return <UserAttendanceCard item={item} />;
  };
  return (
    <>
      <View
        style={[
          {
            paddingTop: 20,
            backgroundColor: theme === "dark" ? "black" : "white",
            paddingHorizontal: 10,
          },
        ]}
      >
        <Text style={[styles.bold]}>
          Total Attendance Time: {secondsToHHMMSS(totalClassTime)}
        </Text>
      </View>
      <FlatList
        data={rankedStudentsAttendance}
        renderItem={renderRankedStudentItem}
        ListEmptyComponent={() => (
          <Text>No students available for this course</Text>
        )}
        ItemSeparatorComponent={() => (
          <View style={[styles.transBg, { paddingVertical: 5 }]}></View>
        )}
        style={[
          {
            backgroundColor: theme === "dark" ? "black" : "white",
            paddingVertical: 20,
            paddingHorizontal: 10,
          },
        ]}
      />
    </>
  );
}
