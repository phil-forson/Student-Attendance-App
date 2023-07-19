import { View, Text } from "../components/Themed";
import {
  Image,
  ListRenderItem,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import React, { useRef } from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import FullWidthButton from "../components/FullWidthButton";
import { IClassDetails } from "../types";
import CourseCard from "../components/CourseCard";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import { convertToHHMM } from "../utils/utils";
import { event } from "react-native-reanimated";

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

const ItemSeparator = () => <View style={styles.separator} />;

export default function MyCourses({ navigation, route }: any) {
  const theme = useColorScheme();

  const renderItem: ListRenderItem<IClassDetails> = ({ item }) => {
    return <CourseCard course={item} navigation={navigation} />;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark" ? Colors.dark.background : Colors.light.background,
        },
      ]}
    >
      <View style={[styles.contentContainer, styles.transBg, {}]}>
        <View style={[styles.smy, styles.transBg]}>
          <Text
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={[styles.bold, styles.largeText]}
          >
            My Courses
          </Text>
        </View>
      </View>
      {false && (
        <View
          style={[
            styles.my,
            styles.flexOne,
            styles.contentContainer,
            styles.justifyCenter,
            {},
          ]}
        >
          <View
            style={[
              {
                height: 200,
              },
            ]}
          >
            <Image
              source={require("../assets/course.png")}
              style={[
                styles.fullImage,
                {
                  resizeMode: "contain",
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.textCenter,
              styles.semiBold,
              styles.mediumText,
              styles.my,
            ]}
          >
            Join a course to get started
          </Text>
          <FullWidthButton
            text={"Join Course"}
            style={[
              styles.fullWidth,
              {
                backgroundColor: theme === "dark" ? "#121212" : "#fff",
              },
            ]}
            onPress={() => navigation.navigate("CourseDetails")}
          />
        </View>
      )}
      {true && (
        <FlatList
          data={data}
          keyExtractor={(courseClass: IClassDetails) => courseClass.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <ItemSeparator />}
          columnWrapperStyle={styles.column}
          horizontal={false}
          key={2}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
}
