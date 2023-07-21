import { View, Text, InvTouchableOpacity } from "../components/Themed";
import {
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
import { AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";
import { IClassDetails } from "../types";
import { convertToDayString, convertToHHMM } from "../utils/utils";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import ClassCard from "../components/ClassCard";
import { useSwipe } from "../hooks/useSwipe";
import Modal from "react-native-modal";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "react-native";

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

export default function ClassDetails({ navigation, route }: any) {
  const [courseClass, setCourseClass] = useState<any>();

  const [classData, setClassData] = useState(data);

  const [activeTab, setActiveTab] = useState<string>("All");

  const [isModalVisible, setModalVisible] = useState(false);

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
    setCourseClass(route.params);
    console.log("class details ", route.params);
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
        },
      ]}
    >
      <View
        style={[
          styles.transBg,
          styles.flexOne,
          {
            paddingHorizontal: 5,
            paddingVertical: Platform.OS === "ios" ? 10 : 40,
          },
        ]}
      >
        <View
          style={[
            styles.transBg,
            { paddingHorizontal: 20, paddingVertical: 10 },
          ]}
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
                {courseClass?.courseName}
              </Text>
            </View>
          </View>
          <View style={[styles.flexRow, styles.itemsCenter, {marginBottom: 20, marginTop: 10}]}>
            <Fontisto
              name="date"
              size={20}
              color={Colors.dark.tetiary}
              style={[{ paddingRight: 20 }]}
            />

            <Text
              style={[
                styles.bold,
                styles.mediumText,
                styles.mmy,
                { color: Colors.dark.tetiary },
              ]}
            >
              {convertToDayString(new Date(Date.now()))}
            </Text>
          </View>
          <View
            style={[styles.flexRow, styles.itemsCenter, { marginBottom: 40 }]}
          >
            <Ionicons
              name="location"
              size={20}
              color={Colors.dark.tetiary}
              style={[{ paddingRight: 20 }]}
            />
            <Text
              style={[styles.bold, styles.mediumText, styles.my]}
              darkColor={Colors.dark.tetiary}
              lightColor={Colors.dark.tetiary}
            >
              JB Danquah Hall
            </Text>
          </View>
          <View
            style={[styles.flexRow, styles.itemsCenter, { marginBottom: 40 }]}
          >
            <Ionicons
              name="md-book"
              size={20}
              color={Colors.dark.tetiary}
              style={[styles.pr20]}
            />
            <Text
              style={[
                styles.bold,
                styles.mediumText,
                styles.my,
                { paddingRight: 10 },
              ]}
              darkColor={Colors.dark.tetiary}
              lightColor={Colors.dark.tetiary}
            >
              {convertToHHMM(new Date(Date.now()))}
            </Text>
            <Text
              style={[
                styles.bold,
                styles.mediumText,
                styles.my,
                { paddingRight: 10 },
              ]}
              darkColor={Colors.dark.tetiary}
              lightColor={Colors.dark.tetiary}
            >
              -
            </Text>
            <Text
              style={[
                styles.bold,
                styles.mediumText,
                styles.my,
                { paddingRight: 10 },
              ]}
              darkColor={Colors.dark.tetiary}
              lightColor={Colors.dark.tetiary}
            >
              {convertToHHMM(new Date(Date.now()))}
            </Text>
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
                style={[styles.bold, { fontSize: 12 }]}
                darkColor={Colors.dark.tetiary}
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
        {!isBottomSheetVisible && (
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
        )}
      </View>
    </SafeAreaView>
  );
}
