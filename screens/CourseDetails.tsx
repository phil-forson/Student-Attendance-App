import { View, Text, InvTouchableOpacity } from "../components/Themed";
import {
  ActivityIndicator,
  Alert,
  ListRenderItem,
  Platform,
  Pressable,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import { convertToHHMM, groupAndSortClasses } from "../utils/utils";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import ClassCard from "../components/ClassCard";
import { useSwipe } from "../hooks/useSwipe";
import Modal from "react-native-modal";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "react-native";
import useUser from "../hooks/useUser";
import useCourse from "../hooks/useCourse";
import { getAllClassesData, removeClassFromCourse } from "../utils/helpers";
import { IClass } from "../types";
import { Unsubscribe } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

export default function CourseDetails({ navigation, route }: any) {
  const [course, setCourse] = useState<any>();

  const [classesData, setClassesData] = useState<IClass[]>([]);

  const [allClasses, setAllClassesData] = useState<IClass[]>([]);

  const [pastClasses, setPastClassesData] = useState<IClass[]>([]);

  const [upcomingClasses, setUpcomingClassesData] = useState<IClass[]>([]);

  const [ongoingClasses, setOngoingClassesData] = useState<IClass[]>([]);

  const [activeTab, setActiveTab] = useState<string>("All");

  const [isModalVisible, setModalVisible] = useState(false);

  const [isClassModalVisible, setIsClassModalVisible] =
    useState<boolean>(false);

  const [areClassesLoading, setClassesLoading] = useState<boolean>(true);

  const [activeClass, setActiveClass] = useState<IClass>();

  const [unsubscribe, setUnsubscribe] = useState<Unsubscribe>();

  const { userData, isLoading: isUserDataLoading } = useUser();

  const { courseData, isLoading: isCourseDataLoading } = useCourse(
    route.params.uid
  );

  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  const sheetRef = useRef<BottomSheet>(null);

  const flatlistData = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      setIsBottomSheetVisible(false);
    }
  }, []);

  const handleDeleteClass = async () => {
    console.log("deleting class...");

    if (activeClass) {
      const res = await removeClassFromCourse(
        activeClass.uid,
        activeClass?.courseId
      );
      if (res.success) {
        Alert.alert("Success.", res.message);
      } else {
        Alert.alert("Failed.", res.message);
      }
    }
  };

  function onSwipeLeft() {
    console.log("SWIPE_LEFT");

    if (activeTab === "Past") {
      return;
    }
    if (activeTab === "All") {
      setActiveTab("Upcoming");
    }
    if (activeTab === "Upcoming") {
      setActiveTab("Ongoing");
    }
    if (activeTab === "Ongoing") {
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
      setActiveTab("Ongoing");
    }
    if (activeTab === "Ongoing") {
      setActiveTab("Upcoming");
    }
  }

  useLayoutEffect(() => {
    setCourse(route.params);
    console.log(route.params);
  }, []);

  useEffect(() => {
    setClassesLoading(true);

    const classes = courseData?.courseClasses ?? [];

    if (!(classes?.length > 0)) {
      setClassesLoading(false);
      setClassesData([]);
      setAllClassesData([]);
      setPastClassesData([]);
      setUpcomingClassesData([]);
    }

    if (classes?.length > 0) {
      getAllClassesData(classes, setClassesLoading)
        .then(({ enrolledClasses }) => {
          setAllClassesData(enrolledClasses);
          setClassesData(enrolledClasses);
          const groupedClasses = groupAndSortClasses(enrolledClasses);
          setPastClassesData(groupedClasses.past);
          setUpcomingClassesData(groupedClasses.upcoming);
          setOngoingClassesData(groupedClasses.ongoing);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isCourseDataLoading, courseData]);

  useEffect(() => {
    console.log("past classes ", pastClasses);
    console.log("upcoming classes ", upcomingClasses);
    if (activeTab === "All") {
      setClassesData(allClasses);
    } else if (activeTab === "Past") {
      setClassesData(pastClasses);
    } else if (activeTab === "Upcoming") {
      setClassesData(upcomingClasses);
    } else if (activeTab === "Ongoing") {
      setClassesData(ongoingClasses);
    }
  }, [activeTab]);
  const theme = useColorScheme();

  const renderItem: ListRenderItem<IClass> = ({ item }) => {
    if (userData.status === "Teacher") {
      return (
        <ClassCard
          courseClass={item}
          navigation={navigation}
          onPress={() => {
            setIsClassModalVisible(true);
            setActiveClass(item);
          }}
        />
      );
    } else {
      return <ClassCard courseClass={item} navigation={navigation} />;
    }
  };

  const renderBottomSheetItem = useCallback(
    ({ item }: any) => (
      <View style={[styles.transBg, styles.flexRow, styles.itemsCenter]}>
        <Image
          source={require("../assets/profile.jpg")}
          style={[
            {
              borderRadius: 100,
              marginRight: 30,
              width: 50,
              height: 50,
            },
          ]}
        />
        <Text>{item}</Text>
      </View>
    ),
    []
  );

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
              {course?.courseTitle}
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
              style={[
                styles.light,
                { fontSize: 12, color: Colors.dark.tetiary },
              ]}
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
              style={[
                styles.light,
                { fontSize: 12, color: Colors.dark.tetiary },
              ]}
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
                      ? activeTab === "Ongoing"
                        ? Colors.dark.tetiary
                        : Colors.dark.primaryGrey
                      : activeTab === "Ongoing"
                      ? Colors.light.secondaryGrey
                      : Colors.light.primaryGrey,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab("Ongoing")}
            >
              <Text style={[{ textAlign: "center" }]}>Ongoing</Text>
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

        {areClassesLoading && (
          <View
            style={[{ height: 350 }, styles.justifyCenter, styles.itemsCenter]}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
          >
            <ActivityIndicator />
          </View>
        )}

        {classesData && !areClassesLoading && classesData?.length > 0 && (
          <FlatList
            data={classesData}
            keyExtractor={(courseClass: IClass) => courseClass.uid}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <CardSeparator viewStyle={[styles.transBg]} />
            )}
            contentContainerStyle={[styles.transBg, { minHeight: 500 }]}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        )}
        {!areClassesLoading && classesData?.length === 0 && (
          <View
            style={[{ height: 350 }, styles.justifyCenter, styles.itemsCenter]}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
          >
            <Text style={[styles.mediumText]}>No classes available</Text>
          </View>
        )}
        {isModalVisible && (
          <Modal
            isVisible={isModalVisible}
            hasBackdrop={true}
            backdropColor={
              theme === "dark"
                ? Colors.dark.primaryGrey
                : Colors.light.background
            }
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
                onPress={() => {
                  navigation.navigate("CreateClass", course);
                  setModalVisible(false);
                }}
              >
                <Ionicons
                  name="add-circle"
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
                  Create Class
                </Text>
              </InvTouchableOpacity>
              <InvTouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    height: 50,
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setIsBottomSheetVisible(true);
                  console.log("done");
                }}
              >
                <Ionicons
                  name="people"
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
                  View Members
                </Text>
              </InvTouchableOpacity>
            </View>
          </Modal>
        )}
        {isClassModalVisible && (
          <Modal
            isVisible={isClassModalVisible}
            hasBackdrop={true}
            backdropColor={
              theme === "dark"
                ? Colors.dark.primaryGrey
                : Colors.light.background
            }
            backdropOpacity={0.5}
            onBackdropPress={() => setIsClassModalVisible(false)}
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
                onPress={() => {
                  setIsClassModalVisible(false);
                  navigation.navigate("ClassDetails", activeClass);
                }}
              >
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={Colors.light.tabIconSelected}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 15,
                    fontWeight: "600",
                    color: Colors.light.tabIconSelected,
                  }}
                >
                  View Class Details
                </Text>
              </InvTouchableOpacity>
              <InvTouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    height: 50,
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setIsClassModalVisible(false);
                  navigation.navigate("EditClass", activeClass);
                }}
              >
                <FontAwesome
                  name="edit"
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
                  Edit Class
                </Text>
              </InvTouchableOpacity>
              <InvTouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    height: 50,
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setIsClassModalVisible(false);
                  Alert.alert(
                    "Delete Class",
                    `Do you want to continue to delete the class '${activeClass?.classTitle}'`,
                    [
                      {
                        text: "No",
                      },
                      {
                        text: "Yes",
                        style: "destructive",
                        onPress: handleDeleteClass,
                      },
                    ]
                  );
                }}
              >
                <Ionicons
                  name="ios-trash-bin"
                  size={20}
                  color={Colors.danger}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 15,
                    fontWeight: "600",
                    color: Colors.danger,
                  }}
                >
                  Delete Class
                </Text>
              </InvTouchableOpacity>
            </View>
          </Modal>
        )}
        {isBottomSheetVisible && (
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChange}
            style={[styles.contentContainer]}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor:
                theme === "dark" ? "#1b1b1b" : Colors.light.background,
            }}
          >
            <Text style={[styles.bigText, styles.my, styles.bold]}>
              Members
            </Text>
            <BottomSheetFlatList
              data={flatlistData}
              keyExtractor={(i: any) => i}
              renderItem={renderBottomSheetItem}
              ItemSeparatorComponent={() => (
                <CardSeparator viewStyle={[styles.transBg]} />
              )}
            />
          </BottomSheet>
        )}
      </View>
      {!isBottomSheetVisible && userData && (
        <InvTouchableOpacity
          style={[
            styles.courseDeetsIcon,
            styles.circle,
            styles.shadow,
            {
              shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
              zIndex: 10,
            },
          ]}
          onPress={() => {
            if (userData.status === "Student") {
              setIsBottomSheetVisible(true);
            } else if (userData.status === "Teacher") {
              setModalVisible(true);
            }
          }}
          darkColor="#0c0c0c"
        >
          <AntDesign
            name={userData.status === "Student" ? "eye" : "plus"}
            color={"#007bff"}
            size={18}
            style={{ fontWeight: "bold" }}
          />
        </InvTouchableOpacity>
      )}
    </SafeAreaView>
  );
}
