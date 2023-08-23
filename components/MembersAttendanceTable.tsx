import { View, Text, ListRenderItem, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/styles";
import { FlatList } from "react-native-gesture-handler";
import Colors from "../constants/Colors";

type Props = {
  data: Array<any>;
};

export default function MembersAttendanceTable({ data }: Props) {
  const theme = useColorScheme();

  const [classStarted, setClassStarted] = useState<boolean>(false);

  useEffect(() => {}, []);
  const renderTableRow: ListRenderItem<any> = ({ item }: any) => {
    console.log("item", item);
    const newDate = new Date(item?.classData?.classDate);
    newDate.setHours(item?.classData?.classStartTime.toDate().getHours());
    newDate.setMinutes(item?.classData?.classStartTime.toDate().getMinutes());

    const now = new Date();

    return (
      <View style={[styles.row]}>
        <Text
          style={[
            styles.tableCell,
            {
              borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
            },
          ]}
        >
          {item.userData?.userId}
        </Text>
        <Text
          style={[
            styles.tableCell,
            {
              borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
            },
          ]}
        >{`${item.userData?.firstName} ${item.userData?.lastName}`}</Text>
        <Text
          style={[
            styles.tableCell,
            {
              borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
            },
          ]}
        >
          {newDate > now
            ? item.attendanceData?.clockIn === null
              ? "Absent"
              : "Present"
            : "Not Yet Started"}
        </Text>
      </View>
    );
  };
  return (
    <View style={[styles.flexOne, { padding: 16 }]}>
      <View style={[styles.headerRow]}>
        <Text
          style={[
            styles.headerCell,
            {
              borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
            },
          ]}
        >
          Id
        </Text>
        <Text
          style={[
            styles.headerCell,
            {
              borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
            },
          ]}
        >
          Name
        </Text>
        <Text
          style={[
            styles.headerCell,
            {
              borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
            },
          ]}
        >
          Attendance Status
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderTableRow}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View
            style={[
              styles.transBg,
              styles.flexOne,
              styles.justifyCenter,
              styles.itemsCenter,
              ,{
                borderWidth: 3,
                paddingVertical: 10,
                borderColor:
                theme === "dark"
                  ? Colors.dark.primaryGrey
                  : Colors.light.tetiary,
              }
            ]}
          >
            <Text style={[]}>No data found</Text>
          </View>
        )}
      />
    </View>
  );
}
