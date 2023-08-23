import {
  ActivityIndicator,
  ListRenderItem,
  Platform,
  Pressable,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { View, Text, TouchableOpacity } from "../components/Themed";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import {
  calculateDuration,
  calculateDurationInHHMMSS,
  convertToDayString,
  convertToHHMM,
  removeSpacesFromString,
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
import StyledInput from "../components/StyledInput";
import MembersAttendanceTable from "../components/MembersAttendanceTable";
import FullWidthButton from "../components/FullWidthButton";
import { shareExcel } from "../utils/excel";

export default function AttendanceScreen({ navigation }: any) {
  const theme = useColorScheme();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const [coursesData, setCoursesData] = useState<ICourse[]>();

  const [membersAttendanceData, setMembersAttendanceData] = useState<any>([]);

  const [filteredMembersData, setFilteredMembersData] = useState<any>([]);

  const [groupedClasses, setGroupedClasses] = useState<any>();

  const [totalClassTime, setTotalClassTime] = useState<number>(0);

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

  const [searchValue, setSearchValue] = useState<string>("");

  const [activeTab, setActiveTab] = useState<ICourse>();

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChange = useCallback((index: number) => {
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

    if (activeTab) {
      try {
        setMembersAttendanceLoading(true);
        const enrolledStudentIds = activeTab?.enrolledStudents;

        if (enrolledStudentIds.length > 0) {
          getUsersWithAttendanceData(enrolledStudentIds, classId).then(
            (res) => {
              console.log("members data ", res);
              setMembersAttendanceLoading(false);
              setMembersAttendanceData(res);
              setFilteredMembersData(res);
            }
          );
        } else {
        }
      } catch (error) {
        setMembersAttendanceLoading(false);
      }
    }
  };

  const generateExcelSheet = () => {
    console.log("generating...");
    shareExcel(membersAttendanceData);
  };

  const groupClassesByDate = async (activeCourse: ICourse) => {
    console.log("grouping classes by date");
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
  };

  const handleFilterMembers = (search: string) => {
    const filteredResults = membersAttendanceData.filter((memberData: any) => {
      const fullName = removeSpacesFromString(
        memberData.userData.firstName + memberData.userData.lastName
      ).toLowerCase();
      const stringWithoutSpaces = removeSpacesFromString(search).toLowerCase();
      const userId = memberData.userData.userId;
      return fullName.includes(stringWithoutSpaces) || userId.includes(search);
    });
    setFilteredMembersData(filteredResults);
  };

  useEffect(() => {
    handleFilterMembers(searchValue);
  }, [searchValue]);
  useEffect(() => {
    try {
      const courses = userData.createdCourses;
      getAllCoursesData(courses, setCoursesLoading).then(
        async (res: ICourse[]) => {
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

            const totalClassTime = await calculateTotalClassTime(activeTab.uid);
            setTotalClassTime(totalClassTime);

            console.log("ranking students");
            setRankedStudentsAttendance(rankedStudents);
            setRankedStudentsLoading(false);
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
                  navigation.navigate("AllStudentsAttendance", {
                    rankedStudentsAttendance,
                    totalClassTime,
                  })
                }
              >
                <Text
                  style={[
                    {
                      color:
                        theme === "dark"
                          ? Colors.deSaturatedPurple
                          : Colors.mainPurple,
                    },
                  ]}
                >
                  View all
                </Text>
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
          style={[styles.contentContainer, styles.sheetShadow]}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor:
              theme === "dark"
                ? Colors.dark.secondaryGrey
                : Colors.light.primaryGrey,
          }}
        >
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.transBg,
              styles.itemsCenter,
            ]}
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
              Members{" "}
              {membersAttendanceLoading ? (
                <ActivityIndicator />
              ) : (
                <Text>({membersAttendanceData.length})</Text>
              )}
            </Text>
            {!membersAttendanceLoading && (
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: theme == "dark" ? Colors.deSaturatedPurple : Colors.mainPurple,
                    padding: 10,
                    borderRadius: 100,
                  },
                ]}
                onPress={generateExcelSheet}
              >
                {Platform.OS === "ios" ? (
                  <Entypo name="share-alternative" size={20} color={"white"} />
                ) : (
                  <Entypo name="share" size={20} color={"white"} />
                )}
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.my]}>
            <StyledInput
              keyboardType="default"
              placeholder="Search members by name or student id"
              placeholderTextColor="gray"
              secure={false}
              value={searchValue}
              setValue={setSearchValue}
              onFocus={() => sheetRef.current?.snapToIndex(2)}
            />
          </View>
          {!membersAttendanceLoading && (
            <MembersAttendanceTable data={filteredMembersData} />
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
  setBottomSheetVisible,
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
                ? Colors.deSaturatedPurple
                : Colors.dark.primaryGrey
              : activeTab?.uid === tabItem.uid
              ? Colors.mainPurple
              : Colors.light.primaryGrey,
          borderBottomWidth: 3,
          width: 180,
        },
      ]}
      onPress={() => {
        setBottomSheetVisible(false);
        setActiveTab(tabItem);
      }}
    >
      <Text
        style={[
          {
            textAlign: "center",
            color:
              theme === "dark"
                ? activeTab?.uid === tabItem.uid
                  ? Colors.deSaturatedPurple
                  : "white"
                : activeTab?.uid === tabItem.uid
                ? Colors.mainPurple
                : "black",
          },
        ]}
      >
        {truncateTextWithEllipsis(tabItem?.courseTitle, 25)}
      </Text>
    </Pressable>
  );
};
