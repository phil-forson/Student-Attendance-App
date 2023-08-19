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
  Pressable,
} from "react-native";
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import {
  convertToDayString,
  convertToHHMM,
  getClassesTodayAndFuture,
  groupAndSortClasses,
} from "../utils/utils";
import { IClass, UserData } from "../types";
import Colors from "../constants/Colors";
import useUser from "../hooks/useUser";
import Loading from "../components/Loading";
import { UserContext } from "../contexts/UserContext";
import GetStarted from "../components/GetStarted";
import {
  getAllClassesData,
  getAllCoursesData,
  isUserClockedInAndNotClockedOut,
} from "../utils/helpers";
import CourseClassCard from "../components/CourseClassCard";
import ClockedInCard from "../components/ClockedInCard";
import ClockInSheet from "../components/ClockInSheet";

export const HomeScreen = ({ navigation, route }: any) => {
  const theme = useColorScheme();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const { user } = useAuth();

  const [areCoursesLoading, setAreCoursesLoading] = useState<boolean>(false);

  const [areClassesLoading, setAreClassesLoading] = useState<boolean>(false);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [userClockedIn, setUserClockedIn] = useState<boolean>(false);

  const [todaysClasses, setTodaysClasses] = useState<IClass[]>([]);

  const [onGoingClasses, setOngoingClasses] = useState<IClass[]>([]);

  const onRefresh = useCallback(() => {}, []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["75%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderItem: ListRenderItem<IClass> = ({ item }) => {
    return <CourseClassCard courseClass={item} navigation={navigation} />;
  };

  const courseClassDeets = {
    id: "1",
    startTime: convertToHHMM(new Date(Date.now())),
    endTime: convertToHHMM(new Date(Date.now())),
    date: convertToHHMM(new Date(Date.now())),
    duration: "7h 50m",
  };

  useEffect(() => {
    if (isUserDataLoading) {
      return;
    }

    const courses =
      userData.status === "Student"
        ? userData.enrolledCourses
        : userData.createdCourses;

    console.log("user courses ", courses);
    console.log("user data courses ", userData.enrolledCourses);

    if (courses.length > 0) {
      getAllCoursesData(courses, setAreCoursesLoading).then((res) => {
        console.log("res ", res);
        const coursesClasses = res.flatMap((item) => item?.courseClasses);
        console.log("resss ", coursesClasses);

        if (coursesClasses.length > 0) {
          getAllClassesData(coursesClasses, setAreClassesLoading).then(
            ({ enrolledClasses }) => {
              const todaysClasses = getClassesTodayAndFuture(enrolledClasses);
              console.log("today's classes ", todaysClasses);
              const { ongoing, past, upcoming } =
                groupAndSortClasses(todaysClasses);
              setTodaysClasses(todaysClasses);
              setOngoingClasses(ongoing);
            }
          );
        }
      });
    }

    console.log("user data================", userData);
    setUserClockedIn(userData?.clockedIn);

    // const classesHappeningToday = getClassesTodayAndFuture(userData.courseClasses)
  }, [isUserDataLoading, userData]);

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
          <Pressable
            style={[
              styles.smy,
              styles.transBg,
              styles.rounded,
              { width: 40, height: 40 },
            ]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Image
              source={require("../assets/profile.jpg")}
              style={[styles.fullImage, { borderRadius: 100 }]}
            />
          </Pressable>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleIndicatorStyle={{ display: "none" }}
          backgroundStyle={{
            backgroundColor:
              theme === "dark"
                ? Colors.dark.primaryGrey
                : Colors.light.background,
          }}
        >
          <View style={[styles.contentContainer, styles.transBg]}>
            {userClockedIn && (
              <>
                <Text style={[styles.bold, styles.smy]}>Clocked In</Text>
                <ClockedInCard
                  classId={userData?.classClockedIn}
                  navigation={navigation}
                />
              </>
            )}
            {(userData?.status === "Student" &&
              !userData?.enrolledCourses?.length) ||
              (userData?.status === "Teacher" &&
                !userData?.createdCourses?.length && (
                  <GetStarted
                    userStatus={userData?.status}
                    navigation={navigation}
                  />
                ))}
          </View>
          {onGoingClasses?.length > 0 && (
            <>
              <Text
                style={[styles.bold, styles.transBg, styles.contentContainer]}
              >
                Ongoing
              </Text>
              {!areClassesLoading ? (
                <View style={[styles.transBg]}>
                  <FlatList
                    data={onGoingClasses}
                    keyExtractor={(courseClass: IClass) => courseClass.uid}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => (
                      <CardSeparator viewStyle={[styles.transBg]} />
                    )}
                    contentContainerStyle={[
                      styles.contentContainer,
                      styles.transBg,
                    ]}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.transBg,
                    styles.justifyCenter,
                    styles.itemsCenter,
                    { height: 100 },
                  ]}
                >
                  <ActivityIndicator />
                </View>
              )}
            </>
          )}

          {userData?.status === "Student" &&
            userData?.enrolledCourses?.length > 0 && (
              <>
                <Text
                  style={[styles.bold, styles.transBg, styles.contentContainer]}
                >
                  Today
                </Text>
                {!areClassesLoading ? (
                  todaysClasses.length > 0 ? (
                    <View style={[styles.transBg]}>
                      <FlatList
                        data={todaysClasses}
                        keyExtractor={(courseClass: IClass) => courseClass.uid}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => (
                          <CardSeparator viewStyle={[styles.transBg]} />
                        )}
                        contentContainerStyle={[
                          styles.contentContainer,
                          styles.transBg,
                        ]}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.transBg,
                        styles.contentContainer,
                        styles.justifyCenter,
                        styles.itemsCenter,
                        { height: 100 },
                      ]}
                    >
                      <Text style={[styles.semiBold]}>
                        No classes for today
                      </Text>
                    </View>
                  )
                ) : (
                  <View
                    style={[
                      styles.transBg,
                      styles.justifyCenter,
                      styles.itemsCenter,
                      { height: 100 },
                    ]}
                  >
                    <ActivityIndicator />
                  </View>
                )}
              </>
            )}

          {userData?.status === "Teacher" &&
            userData?.createdCourses?.length > 0 && (
              <>
                <Text
                  style={[styles.bold, styles.transBg, styles.contentContainer]}
                >
                  Today
                </Text>
                {!areClassesLoading ? (
                  todaysClasses.length > 0 ? (
                    <View style={[styles.transBg]}>
                      <FlatList
                        data={todaysClasses}
                        keyExtractor={(courseClass: IClass) => courseClass.uid}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => (
                          <CardSeparator viewStyle={[styles.transBg]} />
                        )}
                        contentContainerStyle={[
                          styles.contentContainer,
                          styles.transBg,
                        ]}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.transBg,
                        styles.contentContainer,
                        styles.justifyCenter,
                        styles.itemsCenter,
                        { height: 100 },
                      ]}
                    >
                      <Text style={[styles.semiBold]}>
                        No classes for today
                      </Text>
                    </View>
                  )
                ) : (
                  <View
                    style={[
                      styles.transBg,
                      styles.justifyCenter,
                      styles.itemsCenter,
                      { height: 100 },
                    ]}
                  >
                    <ActivityIndicator />
                  </View>
                )}
              </>
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
                userData.status === "Student" ? "JoinCourse" : "CreateCourse"
              );
            }}
            darkColor="#0c0c0c"
          >
            <AntDesign
              name="plus"
              color={Colors.mainPurple}
              size={24}
              style={{ fontWeight: "bold" }}
            />
          </InvTouchableOpacity>
        </BottomSheet>
      </SafeAreaView>
      <StatusBar style={"auto"} />
    </>
  );
};
