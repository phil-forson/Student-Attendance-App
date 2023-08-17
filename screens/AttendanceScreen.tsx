import {
  ActivityIndicator,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { View, Text } from "../components/Themed";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import {
  calculateDuration,
  calculateDurationInHHMMSS,
  convertToDayString,
  convertToHHMM,
  secondsToHHMMSS,
  truncateTextWithEllipsis,
} from "../utils/utils";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import ClassCard from "../components/ClassCard";
import useUser from "../hooks/useUser";
import {
  calculateAttendanceRanking,
  calculateTotalClassTime,
  getAllClassesData,
  getAllCoursesData,
  getAllUsersAttendance,
  getMembersWithAttendance,
  getUsersForCourseAttendanceData,
  getUsersWithAttendanceData,
} from "../utils/helpers";
import { IClass, ICourse } from "../types";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import useClass from "../hooks/useClass";
import { Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import ClassGroupItem from "../components/ClassGroupItem";
import UserAttendanceCard from "../components/UserAttendanceCard";

export default function AttendanceScreen({ navigation }: any) {
  const theme = useColorScheme();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const [coursesData, setCoursesData] = useState<ICourse[]>();

  const [membersAttendanceData, setMembersAttendanceData] = useState<any>([]);

  const [groupedClasses, setGroupedClasses] = useState<any>();

  const [totalClassTime, setTotalClassTime] = useState<number>(0)

  const [rankedStudentsAttendance, setRankedStudentsAttendance] =
    useState<any>();

  const [rankedStudentsLoading, setRankedStudentsLoading] =
    useState<boolean>(false);

  const [areCoursesLoading, setCoursesLoading] = useState<boolean>(false);

  const [areClassesLoading, setClassesLoading] = useState<boolean>(false);

  const [membersAttendanceLoading, setMembersAttendanceLoading] =
    useState<boolean>(false);

  const [attendanceDataLoading, setAttendanceDataLoading] =
    useState<boolean>(false);

  const [isBottomSheetVisible, setBottomSheetVisible] =
    useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<ICourse>();

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      setBottomSheetVisible(false);
    }
  }, []);

  const renderCourseItem: ListRenderItem<any> = ({ item }) => {
    return (
      <TabGroup
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabItem={item}
        setBottomSheetVisible={setBottomSheetVisible}
      />
    );
  };

  const renderClassGroupItem: ListRenderItem<any> = ({ item }) => {
    return (
      <ClassGroupItem
        item={item}
        handleClassItemPressed={handleClassItemPressed}
      />
    );
  };

  const renderRankedStudentItem: ListRenderItem<any> = ({ item }) => {
    return <UserAttendanceCard item={item} />;
  };

  const renderBottomSheetItem = useCallback(({ item }: any) => {
    const didNotClockIn = item?.attendanceData ? false : true;
    const clockInInvalid =
      item?.attendanceData?.clockIn === null ||
      item?.attendanceData?.clockOut === null;
    return (
      <View
        style={[
          styles.flexRow,
          styles.itemsCenter,
          styles.justifyBetween,
          styles.rounded,
          {
            padding: 15,
          },
        ]}
      >
        <Text>
          {item?.userData.firstName}
          {"  "}
          {item?.userData.lastName}
        </Text>
        <Text>
          {didNotClockIn || clockInInvalid
            ? calculateDurationInHHMMSS(
                Timestamp.fromDate(new Date()),
                Timestamp.fromDate(new Date())
              )
            : calculateDurationInHHMMSS(
                item?.attendanceData?.clockIn,
                item?.attendanceData?.clockOut
              )}
        </Text>
      </View>
    );
  }, []);

  const handleClassItemPressed = async (classId: string) => {
    setBottomSheetVisible(true);
    console.log("attendance loading...");

    if (activeTab) {
      try {
        setMembersAttendanceLoading(true);
        const enrolledStudentIds = activeTab?.enrolledStudents;

        if (enrolledStudentIds.length > 0) {
          getUsersWithAttendanceData(enrolledStudentIds, classId).then(
            (res) => {
              console.log("res ", res);
              setMembersAttendanceLoading(false);
              setMembersAttendanceData(res);
            }
          );
        } else {
        }
        console.log("class item pressed ", classId);
      } catch (error) {
        setMembersAttendanceLoading(false);
      } finally {
        console.log("attendance deloading...");
      }
    }
  };

  const groupClassesByDate = async (activeCourse: ICourse) => {
    const classesData = await getAllClassesData(
      activeCourse.courseClasses,
      setClassesLoading
    );

    const groupedClasses = Object.values(
      classesData.enrolledClasses.reduce(
        (result: Record<string, IClass[]>, courseClass: IClass) => {
          const classDateStr = courseClass.classDate
            ?.toDate()
            .toISOString()
            .split("T")[0];
          // Convert Timestamp to string date
          if (!result[classDateStr]) {
            result[classDateStr] = [];
          }
          result[classDateStr].push(courseClass);
          return result;
        },
        {}
      )
    );

    setGroupedClasses(groupedClasses);

    console.log("groupedClasses ", groupedClasses);
  };

  useEffect(() => {
    try {
      const courses = userData.createdCourses;
      getAllCoursesData(courses, setCoursesLoading).then(
        async (res: ICourse[]) => {
          console.log("res ", res);
          setCoursesData(res);
          setActiveTab(res[0]);

          const activeCourse = res[0];

          groupClassesByDate(activeCourse);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, [userData, isUserDataLoading]);

  useEffect(() => {
    const sortStudentByAttendance = async () => {
      if (activeTab) {
        try {
          groupClassesByDate(activeTab);
          if (
            activeTab.courseClasses.length > 0 &&
            activeTab.enrolledStudents.length > 0
          ) {
            setRankedStudentsLoading(true);
            const userDataAndAttendance = await getUsersForCourseAttendanceData(
              activeTab.enrolledStudents,
              activeTab.courseClasses
            );
            const rankedStudents = calculateAttendanceRanking(
              userDataAndAttendance
            );

            const totalClassTime = await calculateTotalClassTime(activeTab.uid)
            console.log('total class time ', totalClassTime)
            setTotalClassTime(totalClassTime)

            setRankedStudentsAttendance(rankedStudents);
            setRankedStudentsLoading(false);
            console.log("ranked students", rankedStudents);
          } else {
            setRankedStudentsAttendance([]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    sortStudentByAttendance();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab) {
    }
  }, []);

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
      <View style={[styles.contentContainer]}>
        {!areCoursesLoading && (
          <FlatList
            horizontal
            data={coursesData ?? []}
            renderItem={renderCourseItem}
            showsHorizontalScrollIndicator={false}
            style={[{ height: 40 }]}
          />
        )}

        {areCoursesLoading && (
          <View
            style={[
              styles.transBg,
              styles.flexOne,
              styles.justifyCenter,
              styles.itemsCenter,
            ]}
          >
            <ActivityIndicator />
          </View>
        )}

        <View style={[styles.transBg]}>
          {!areCoursesLoading && groupedClasses?.length > 0 && (
            <View
              style={[
                styles.transBg,
                styles.flexRow,
                styles.justifyBetween,
                { marginBottom: 5 },
              ]}
            >
              <Text style={[styles.semiBold, { color: Colors.dark.tetiary }]}>
                Student Ranking
              </Text>
              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "AllStudentsAttendance",
                    {rankedStudentsAttendance, totalClassTime}
                  )
                }
              >
                <Text>View all</Text>
              </Pressable>
            </View>
          )}

          {rankedStudentsLoading
            ? !areCoursesLoading && (
                <View style={[styles.transBg, styles.itemsCenter]}>
                  <ActivityIndicator />
                </View>
              )
            : groupedClasses?.length > 0 && (
                <FlatList
                  data={rankedStudentsAttendance?.slice(0, 3)}
                  renderItem={renderRankedStudentItem}
                  ListEmptyComponent={() => (
                    <Text>No students available for this course</Text>
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={[styles.transBg, { paddingVertical: 5 }]}
                    ></View>
                  )}
                />
              )}
        </View>

        {groupedClasses && !areClassesLoading && (
          <FlatList
            data={groupedClasses}
            style={[styles.mmy, { paddingHorizontal: 0 }]}
            ItemSeparatorComponent={() => <View style={[styles.my]}></View>}
            renderItem={renderClassGroupItem}
            ListEmptyComponent={() => (
              <View
                style={[
                  styles.transBg,
                  styles.flexOne,
                  styles.justifyCenter,
                  styles.itemsCenter,
                ]}
              >
                <Text>No Classes for this course</Text>
              </View>
            )}
          />
        )}
        {areClassesLoading && !areCoursesLoading && (
          <View
            style={[
              styles.transBg,
              styles.flexOne,
              styles.justifyCenter,
              styles.itemsCenter,
              styles.mmy,
            ]}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
      {isBottomSheetVisible && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          style={[styles.contentContainer]}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor:
              theme === "dark"
                ? Colors.dark.secondaryGrey
                : Colors.light.primaryGrey,
          }}
        >
          <Text
            style={[
              styles.bigText,
              styles.my,
              styles.bold,
              {
                borderTopWidth: 1,
                borderBottomColor:
                  theme === "dark"
                    ? Colors.dark.background
                    : Colors.light.background,
              },
            ]}
          >
            Members
          </Text>
          {!membersAttendanceLoading && (
            <BottomSheetFlatList
              data={membersAttendanceData}
              keyExtractor={(item: any) => item.userData?.email}
              renderItem={renderBottomSheetItem}
              ItemSeparatorComponent={() => (
                <View style={[{ paddingVertical: 5 }, styles.transBg]}></View>
              )}
            />
          )}
          {membersAttendanceLoading && (
            <View
              style={[
                styles.transBg,
                styles.justifyCenter,
                styles.itemsCenter,
                { height: 50 },
              ]}
            >
              <ActivityIndicator />
            </View>
          )}
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const TabGroup = ({
  activeTab,
  setActiveTab,
  tabItem,
  setBottomSheetVisible
}: {
  activeTab: any;
  setActiveTab: React.Dispatch<React.SetStateAction<any>>;
  tabItem: ICourse;
  setBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const theme = useColorScheme();
  return (
    <Pressable
      style={[
        styles.h30,
        styles.flexOne,
        {
          borderBottomColor:
            theme === "dark"
              ? activeTab?.uid === tabItem.uid
                ? Colors.dark.tetiary
                : Colors.dark.primaryGrey
              : activeTab?.uid === tabItem.uid
              ? Colors.light.secondaryGrey
              : Colors.light.primaryGrey,
          borderBottomWidth: 3,
          width: 180,
        },
      ]}
      onPress={() => {
        setBottomSheetVisible(false)
         setActiveTab(tabItem)
      }}
    >
      <Text style={[{ textAlign: "center" }]}>
        {truncateTextWithEllipsis(tabItem?.courseTitle, 25)}
      </Text>
    </Pressable>
  );
};
