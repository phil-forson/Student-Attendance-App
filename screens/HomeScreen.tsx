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
  ActivityIndicator,
} from "react-native";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  InvTouchableOpacity,
  Text,
  TouchableOpacity,
  View,
} from "../components/Themed";
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
import { convertToDayString, convertToHHMM } from "../utils/utils";
import { IClassDetails, UserData } from "../types";
import Colors from "../constants/Colors";
import useUser from "../hooks/useUser";
import Loading from "../components/Loading";
import { UserContext } from "../contexts/UserContext";
import GetStarted from "../components/GetStarted";

var width = Dimensions.get("window").width;

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

export const HomeScreen = ({ navigation, route }: any) => {
  const theme = useColorScheme();



  const { userData, isLoading: isUserDataLoading } = useUser() 

  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [isStudent, setIsStudent] = useState<boolean>(true);

  const onRefresh = useCallback(() => {}, []);



  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["75%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderItem: ListRenderItem<IClassDetails> = ({ item }) => {
    return <ClassCard courseClass={item} navigation={navigation} />;
  };

  const courseClassDeets = {
    id: "1",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    date: convertToHHMM(new Date(Date.now())),
    duration: "7h 50m",
  };



  if (isUserDataLoading) {
    return <Loading />;
  }

  return (
    <>
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
          <View style={[styles.transBg]}>
            <View style={[styles.transBg]}>
              <Text
                lightColor={Colors.dark.background}
                darkColor={Colors.dark.text}
                style={[styles.largeText, styles.bold, styles.smy]}
              >
                {convertToDayString(new Date(Date.now()))}
              </Text>
            </View>
            <View style={[styles.transBg]}>
              <Text
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
                style={[styles.mediumText, styles.semiBold, styles.smy]}
              >
                Good Day
              </Text>
            </View>
            <View style={[styles.transBg]}>
              <Text
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
                style={[styles.smy, styles.semiBold, styles.bigText]}
              >
                {userData?.firstName}
              </Text>
            </View>
          </View>
          <View style={[styles.smy, styles.transBg]}>
            <Text lightColor={Colors.light.text} darkColor={Colors.dark.text}>
              Profile
            </Text>
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleIndicatorStyle={{ display: "none" }}
          backgroundStyle={{
            backgroundColor:
              theme === "dark" ? "#1b1b1b" : Colors.light.background,
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
            {(userData?.status === "Student" && !userData?.enrolledCourses?.length) || (userData?.status==="Teacher" && !userData?.createdCourses?.length) && (
              <GetStarted userStatus={userData?.status} navigation={navigation}/>
            )}

            {false && (
              <>
                <Text style={[styles.bold, styles.smy]}>Log Files</Text>

                <View
                  style={[styles.flexRow, styles.justifyBetween]}
                  darkColor={Colors.dark.secondaryGrey}
                >
                  <TouchableOpacity style={[{ height: 50 }]}></TouchableOpacity>
                  <TouchableOpacity></TouchableOpacity>
                </View>
              </>
            )}
          </View>
          {false && (
            <Text style={[styles.bold, styles.my, styles.transBg]}>
              Upcoming Classes
            </Text>
          )}
          {false && (
            <BottomSheetFlatList
              data={data}
              keyExtractor={(courseClass: IClassDetails) => courseClass.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => (
                <CardSeparator viewStyle={[styles.transBg]} />
              )}
              contentContainerStyle={[styles.contentContainer, styles.transBg]}
            />
          )}
          <InvTouchableOpacity
            style={[
              styles.addCourseIcon,
              styles.circle,
              styles.shadow,
              {
                shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
              },
            ]}
            onPress={() => {
              navigation.navigate(
                userData.status === "Student"
                  ? "JoinCourse"
                  : "CreateCourse"
              );
            }}
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
      <StatusBar style={"auto"} />
    </>
  );
};
