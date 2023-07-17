import {
  StyleSheet,
  useColorScheme,
  FlatList,
  Image,
  Dimensions,
  Platform,
  Alert,
  RefreshControl,
  ListRenderItem,
  ScrollView,
} from "react-native";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { InvTouchableOpacity, Text, TouchableOpacity, View } from "../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import {
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CardSeparator from "../components/CardSeparator";
import CourseCard from "../components/CourseCard";
import Constants from "expo-constants";
import Modal from "react-native-modal";
import JoinCourseModal from "../components/JoinCourseModal";
import React, { useEffect } from "react";
import { styles } from "../styles/styles";
import { StatusBar } from "expo-status-bar";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import FullWidthButton from "../components/FullWidthButton";
import ClassCard from "../components/ClassCard";
import { convertToDayString } from "../utils/utils";
import { IClassDetails } from "../types";

var width = Dimensions.get("window").width;

const data: IClassDetails[] = [
  {
    id: "1",
    courseName: "Agriculture",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    duration: "1h 50m",
    date: new Date(Date.now()),
  },
  {
    id: "2",
    courseName: "Physics",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    duration: "1h 50m",
    date: new Date(Date.now()),
  },
  {
    id: "3",
    courseName: "Chemistry",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    duration: "1h 50m",
    date: new Date(Date.now()),
  },
  {
    id: "4",
    courseName: "Mathematics",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    duration: "1h 50m",
    date: new Date(Date.now()),
  },
];

export const HomeScreen = ({ navigation, route }: any) => {
  const theme = useColorScheme();

  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [isStudent, setIsStudent] = useState<boolean>(true);

  const onRefresh = useCallback(() => {}, []);

  const createCourse = () => {
    setModalVisible(false);
    setTimeout(() => navigation.navigate("CreateCourse"), 800);
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["75%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderItem: ListRenderItem<IClassDetails> = ({ item }) => {
    // Render your list item here using `item` object
    return (
      // JSX representing your list item
      <ClassCard courseClass={item} navigation={navigation} />
    );
  };

  const courseClassDeets = {
    id: "1",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    date: new Date(Date.now()),
    duration: "7h 50m",
  };

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme === "dark" ? "#fff" : "#121212",
            zIndex: -11,
          },
        ]}
      >
        <View
          style={[styles.headerView]}
          darkColor="white"
          lightColor="#121212"
        >
          <View darkColor="white" lightColor="#121212">
            <View darkColor="white" lightColor="#121212">
              <Text
                lightColor="white"
                darkColor="#121212"
                style={[styles.largeText, styles.bold, styles.smy]}
              >
                {convertToDayString(new Date(Date.now()))}
              </Text>
            </View>
            <View darkColor="white" lightColor="#121212">
              <Text
                lightColor="white"
                darkColor="#000"
                style={[styles.mediumText, styles.semiBold, styles.smy]}
              >
                Good Day
              </Text>
            </View>
            <View darkColor="white" lightColor="#121212">
              <Text
                lightColor="white"
                darkColor="black"
                style={[styles.smy, styles.semiBold, styles.bigText]}
              >
                Philemon Forson
              </Text>
            </View>
          </View>
          <View darkColor="white" lightColor="#121212" style={[styles.smy]}>
            <Text lightColor="white" darkColor="black">
              Profile
            </Text>
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: theme === "dark" ? "#121212" : "#fff",
          }}
        >
          <View style={[styles.contentContainer, styles.transBg]}>
            {false && (
              <View darkColor="#121212">
                <View darkColor="#121212">
                  <Text style={[styles.bold, styles.mediumText]}>Today</Text>
                </View>
              </View>
            )}
            {false && (
              <View
                style={[
                  styles.justifyBetween,
                  styles.my,
                  {
                    marginVertical: 40,
                    marginHorizontal: 30,
                  },
                ]}
                darkColor="#121212"
              >
                <Image
                  source={require("../assets/course.png")}
                  style={[
                    { resizeMode: "contain", width: "auto", height: 250 },
                  ]}
                />
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
                />
              </View>
            )}

            <Text style={[styles.bold, styles.smy
            ]}>Log Files</Text>

            <View style={[styles.flexRow, styles.justifyBetween]}>
              <TouchableOpacity style={[{height: 50}]}></TouchableOpacity>
              <TouchableOpacity></TouchableOpacity>
            </View>



            <Text style={[styles.bold, styles.my, styles.transBg]}>
              Upcoming Classes
            </Text>
          </View>
          <BottomSheetFlatList
            data={data}
            keyExtractor={(courseClass: IClassDetails) => courseClass.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <CardSeparator viewStyle={[styles.transBg]} />
            )}
            contentContainerStyle={[styles.contentContainer, styles.transBg]}
          />
          <InvTouchableOpacity
            style={[
              styles.addCourseIcon,
              styles.circle,
              styles.shadow,
              {
                shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
              },
            ]}
            onPress={() => setModalVisible(true)}
            darkColor="#0c0c0c"
          >
            <AntDesign
              name="plus"
              color={"#007bff"}
              size={18}
              style={{ fontWeight: "bold" }}
            />
          </InvTouchableOpacity>
        </BottomSheet>
      </SafeAreaView>
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          hasBackdrop={true}
          backdropColor={theme === "dark" ? "#000" : "#121212"}
          backdropOpacity={0.5}
          onBackdropPress={() => setModalVisible(false)}
          style={[
            {
              padding: 0,
              margin: 0,
            },
          ]}
        >
          <View
            style={[
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: "hidden",
                height: "auto",
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: Platform.OS === "ios" ? 60 : 20,
              },
            ]}
          >
            <InvTouchableOpacity
              style={[
                {
                  flexDirection: "row",
                  height: 50,
                  alignItems: "center",
                },
              ]}
            >
              <AntDesign
                name="addusergroup"
                size={20}
                color={theme === "dark" ? "white" : "#424242"}
              />
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: 15,
                  fontWeight: "600",
                  color: theme === "dark" ? "#fff" : "#424242",
                }}
              >
                Join Course
              </Text>
            </InvTouchableOpacity>
          </View>
        </Modal>
      )}
      <StatusBar style={"inverted"} />
    </>
  );
};
