import { View, Text } from "../components/Themed";
import {
  ListRenderItem,
  Pressable,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "react-native-elements";
import { IClassDetails } from "../types";
import { convertToHHMM } from "../utils/utils";
import { ScrollView } from "react-native-gesture-handler";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import ClassCard from "../components/ClassCard";
import { useSwipe } from "../hooks/useSwipe";

const data: IClassDetails[] = [
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

const upcomingData: IClassDetails[] = [
  {
    id: "1",
    courseName: "Agriculture",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    duration: "1h 50m",
    date: convertToHHMM(new Date(Date.now())),
  },
];

const pastData: IClassDetails[] = [
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
];

export default function CourseDetails({ navigation, route }: any) {
  const [course, setCourse] = useState<any>();

  const [classData, setClassData] = useState(data);

  const [activeTab, setActiveTab] = useState<string>("All");

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    console.log("SWIPE_LEFT");

    if (activeTab === "Past") {
      return;
    }
    if (activeTab === "All") {
      setActiveTab("Upcoming");
    }
    if (activeTab === "Upcoming") {
      setActiveTab("Past");
    }
  }

  function onSwipeRight() {
    console.log("SWIPE_RIGHT");
    if (activeTab === "All") {
      return;
    }
    if (activeTab === "Upcoming") {
      setActiveTab("All");
    }
    if (activeTab === "Past") {
      setActiveTab("Upcoming");
    }
  }

  useLayoutEffect(() => {
    setCourse(route.params);
    console.log(route.params);
  }, []);

  useEffect(() => {
    if (activeTab === "All") {
      setClassData(data);
    } else if (activeTab === "Upcoming") {
      setClassData(upcomingData);
    } else if (activeTab === "Past") {
      setClassData(pastData);
    }
  }, [activeTab]);
  const theme = useColorScheme();

  const renderItem: ListRenderItem<IClassDetails> = ({ item }) => {
    return <ClassCard courseClass={item} navigation={navigation} />;
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark" ? Colors.dark.background : Colors.light.background,
          paddingHorizontal: 20,
          paddingVertical: 10,
        },
      ]}
    >
      <View
        style={[styles.transBg, { paddingHorizontal: 20, paddingVertical: 10 }]}
      >
        <View
          style={[]}
          darkColor={Colors.dark.background}
          lightColor={Colors.light.background}
        >
          <View style={[styles.smy, styles.transBg, styles.flexRow]}>
            <AntDesign
              name="left"
              color={theme === "dark" ? "white" : "black"}
              size={30}
              style={{ marginRight: 8, fontWeight: "800" }}
              onPress={() => navigation.goBack()}
            />
            <Text
              lightColor={Colors.light.text}
              darkColor={Colors.dark.text}
              style={[styles.bold, styles.largeText]}
            >
              {course?.courseName}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              height: 170,
              width: "100%",
              paddingVertical: 10,
              columnGap: 10,
            },
            styles.flexRow,
          ]}
        >
          <View
            lightColor={Colors.light.primaryGrey}
            darkColor={Colors.dark.primaryGrey}
            style={[
              {
                height: "100%",
                flex: 1,
                paddingHorizontal: 15,
                justifyContent: "space-evenly",
              },
              styles.flexColumn,
              styles.rounded,
            ]}
          >
            <Text
              style={[styles.light, { fontSize: 12 }]}
              darkColor={Colors.light.secondaryGrey}
              lightColor={Colors.dark.tetiary}
            >
              Total Attendance Time
            </Text>
            <Text
              style={[
                styles.bold,
                {
                  fontSize: 20,
                },
              ]}
            >
              4h55m
            </Text>
          </View>
          <View
            lightColor={Colors.light.primaryGrey}
            darkColor={Colors.dark.primaryGrey}
            style={[
              {
                height: "100%",
                flex: 1,
                paddingHorizontal: 15,
                justifyContent: "space-evenly",
              },
              styles.flexColumn,
              styles.rounded,
            ]}
          >
            <Text
              style={[styles.light, { fontSize: 12 }]}
              darkColor={Colors.light.secondaryGrey}
              lightColor={Colors.dark.tetiary}
            >
              Total Attendance Time
            </Text>
            <Text
              style={[
                styles.bold,
                {
                  fontSize: 20,
                },
              ]}
            >
              4h55m
            </Text>
          </View>
        </View>
        <View style={[styles.my]}>
          <View style={[styles.flexRow]}>
            <Pressable
              style={[
                styles.h30,
                styles.flexOne,
                {
                  borderBottomColor:
                    theme === "dark"
                      ? activeTab === "All"
                        ? Colors.dark.tetiary
                        : Colors.dark.primaryGrey
                      : activeTab === "All"
                      ? Colors.light.secondaryGrey
                      : Colors.light.primaryGrey,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab("All")}
            >
              <Text style={[{ textAlign: "center" }]}>All</Text>
            </Pressable>
            <Pressable
              style={[
                styles.h30,
                styles.flexOne,
                {
                  borderBottomColor:
                    theme === "dark"
                      ? activeTab === "Upcoming"
                        ? Colors.dark.tetiary
                        : Colors.dark.primaryGrey
                      : activeTab === "Upcoming"
                      ? Colors.light.secondaryGrey
                      : Colors.light.primaryGrey,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab("Upcoming")}
            >
              <Text style={[{ textAlign: "center" }]}>Upcoming</Text>
            </Pressable>
            <Pressable
              style={[
                styles.h30,
                styles.flexOne,
                {
                  borderBottomColor:
                    theme === "dark"
                      ? activeTab === "Past"
                        ? Colors.dark.tetiary
                        : Colors.dark.primaryGrey
                      : activeTab === "Past"
                      ? Colors.light.secondaryGrey
                      : Colors.light.primaryGrey,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab("Past")}
            >
              <Text style={[{ textAlign: "center" }]}>Past</Text>
            </Pressable>
          </View>
        </View>
        <FlatList
          data={classData}
          keyExtractor={(courseClass: IClassDetails) => courseClass.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <CardSeparator viewStyle={[styles.transBg]} />
          )}
          contentContainerStyle={[styles.transBg, { minHeight: 500 }]}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
      </View>
    </SafeAreaView>
  );
}
