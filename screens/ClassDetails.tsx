import { View, Text, InvTouchableOpacity } from "../components/Themed";
import {
  ActivityIndicator,
  ListRenderItem,
  Platform,
  Pressable,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";
import {
  convertToDayString,
  convertToHHMM,
  getValueFor,
  save,
} from "../utils/utils";
import { FlatList } from "react-native";
import CardSeparator from "../components/CardSeparator";
import ClassCard from "../components/ClassCard";
import { useSwipe } from "../hooks/useSwipe";
import Modal from "react-native-modal";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "react-native";
import { IClass } from "../types";
import useCourse from "../hooks/useCourse";
import useClass from "../hooks/useClass";
import Loading from "../components/Loading";
import useUser from "../hooks/useUser";
import ClockInSheet from "../components/ClockInSheet";
import {
  getStudentsClockedIn,
  isUserClockedInAndNotClockedOut,
  userClockIn,
} from "../utils/helpers";
import useAuth from "../hooks/useAuth";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { ClassProvider } from "../providers/ClassProvider";

export default function ClassDetails({ navigation, route }: any) {
  const [courseClass, setCourseClass] = useState<any>();

  const [activeTab, setActiveTab] = useState<string>("All");

  const { userData, isLoading: isUserDataLoading } = useUser();

  const [clockInLoading, setClockInLoading] = useState<boolean>(false);

  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { user } = useAuth();

  const { classData, isLoading: isClassDataLoading } = useClass(
    route.params.uid
  );

  const [clockIn, setClockIn] = useState<boolean>(false);

  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  const [isAlreadyClockedIn, setIsAlreadyClockedIn] = useState<boolean>(false);

  const [isModalVisible, setModalVisible] = useState(false);


  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);

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

  const isBiometricAvailable = async () => {
    try {
      const result = await LocalAuthentication.hasHardwareAsync();
      return result && (await LocalAuthentication.isEnrolledAsync());
    } catch (error) {
      Alert.alert("Biometric authentication is not available on this device.");
      console.error("Error checking biometric availability:", error);
      return false;
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      return await LocalAuthentication.authenticateAsync({});
    } catch (error) {
      Alert.alert("An Error occured ");
    }
  };
  const handleBiometricAuthentication = async () => {
    if (biometricAvailable) {
      return await authenticateWithBiometrics();
    } else {
      // Biometric authentication is not available on this device
      Alert.alert("Biometric authentication is not available on this device.");
    }
  };

  const onClockIn = async () => {
    if (user) {
      setClockInLoading(true);
      try {
        if (isAlreadyClockedIn) {
          console.log("is already clocked in ");
          setModalVisible(false)
          setClockIn(true);
          return;
        }
        const res = await isUserClockedInAndNotClockedOut(
          route.params?.uid,
          user?.uid ?? ""
        );

        if (!res) {
          console.log("yesss");
          await requestPermissionAsync();
          setModalVisible(false);
          const result = await handleBiometricAuthentication();

          if (result?.success) {
            await userClockIn(
              user?.uid,
              route.params.uid,
              userData?.firstName,
              userData?.lastName
            ).then(() => {
              setClockIn(true);
              setModalVisible(false);
            });
          } else {
            Alert.alert("Failed authentication, try again to clock in ");
          }
        } else {
        }
      } catch (error) {
        setClockIn(false);
      } finally {
        setClockInLoading(false);
      }
    }
  };

  // Define the same task name as in app.js
  const BACKGROUND_TASK_NAME = "LOCATION_TASK";

  // Start the background task after successful login

  const getLocation = async () => {
    try {
      console.log("geting jskfldfl");
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      console.log("Current location:", latitude, longitude);
      // Do something with the location data
    } catch (error) {
      console.warn("Location error:", error);
    }
  };

  async function requestBackgroundPermissions() {
    try {
      const [status, requestPermission] = Location.useBackgroundPermissions();
    } catch (error) {
      console.log(error);
    }
  }
  async function requestPermissionAsync() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let res = await Location.requestBackgroundPermissionsAsync();
      console.log("gotten...");
      // await requestBackgroundPermissions()

      console.log("status ", status);
      if (status !== "granted" && res.status !== "granted") {
        console.log("error");
        return;
      }

      console.log("getting location++++ ");
      await getLocation();
    } catch (error) {
      console.log("error ", error);
    }
  }

  //  useEffect(() => {
  //   const startGeofence = async () => {

  //     await requestPermissionAsync()
  //     let region: Location.LocationRegion = {identifier:"1", latitude:59.899489, longitude: 10.611103, radius:10}
  //       Location.startGeofencingAsync("LOCATION_GEOFENCE", [region])

  //       TaskManager.defineTask("LOCATION_GEOFENCE", ({ data: { eventType, region }, error }) => {
  //           if (error) {
  //             console.log('error ', error)
  //             // check `error.message` for more details.
  //             return;
  //           }
  //           if (eventType === Location.GeofencingEventType.Enter) {
  //             alert("enter in region!")
  //             console.log("You've entered region:", region);
  //           } else if (eventType === Location.GeofencingEventType.Exit) {
  //             console.log("You've left region:", region);
  //           }
  //         });
  //   }

  //   startGeofence()
  //  }, [])

  useEffect(() => {
    isBiometricAvailable().then((available) =>
      setBiometricAvailable(available)
    );
  }, []);

  useLayoutEffect(() => {
    setCourseClass(route.params);
    getValueFor("clockIn");
  }, []);

  const handlePlusIconPressed = () => {
    if (userData.status === "Student") {
      const now = new Date();

      if (now < courseClass.classStartTime.toDate().getTime()) {
        Alert.alert("Class not yet started");
      } else if (
        now >= courseClass.classStartTime.toDate().getTime() &&
        now <= courseClass.classEndTime.toDate().getTime()
      ) {
        setModalVisible(true);
      } else {
        Alert.alert("Clock In Failed", "Class already ended");
      }
    } else {
      setModalVisible(true);
    }
  };

  const theme = useColorScheme();

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

  useEffect(() => {
    if (isUserDataLoading) {
      return;
    }

    console.log("user data ", userData?.clockedIn);
    setIsAlreadyClockedIn(userData?.clockedIn);

    if (userData.status === "Teacher") {
    }
  }, [isUserDataLoading, userData]);

  if (isClassDataLoading) {
    return <Loading />;
  }

  if (isUserDataLoading) {
    return <Loading />;
  }
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
                {courseClass?.classTitle}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.itemsCenter,
              { marginBottom: 20, marginTop: 10 },
            ]}
          >
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
              {courseClass &&
                convertToDayString(courseClass?.classDate.toDate())}
            </Text>
          </View>
          <View
            style={[styles.flexRow, styles.itemsCenter, { marginBottom: 20 }]}
          >
            <Ionicons
              name="location"
              size={20}
              color={Colors.dark.tetiary}
              style={[{ paddingRight: 20 }]}
            />
            <Text
              style={[styles.bold, styles.mediumText]}
              darkColor={Colors.dark.tetiary}
              lightColor={Colors.dark.tetiary}
            >
              {courseClass?.classLocation.structured_formatting.main_text}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.itemsCenter,
              { marginBottom: 20, marginTop: 10 },
            ]}
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
              {courseClass &&
                convertToHHMM(courseClass?.classStartTime.toDate())}
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
              {courseClass && convertToHHMM(courseClass?.classEndTime.toDate())}
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
                Total Class Time
              </Text>
              <Text
                style={[
                  styles.bold,
                  {
                    fontSize: 20,
                  },
                ]}
              >2h20m</Text>
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
                10m
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
                {userData.status === "Teacher" ? (
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
                      View Active Members
                    </Text>
                  </InvTouchableOpacity>
                ) : (
                  <InvTouchableOpacity
                    style={[
                      {
                        flexDirection: "row",
                        height: 50,
                        alignItems: "center",
                      },
                    ]}
                    onPress={onClockIn}
                    disabled={clockInLoading}
                  >
                    <AntDesign
                      name="clockcircle"
                      size={20}
                      color={
                        theme === "dark"
                          ? clockInLoading
                            ? Colors.dark.tetiary
                            : "white"
                          : clockInLoading
                          ? Colors.dark.tetiary
                          : "#424242"
                      }
                    />
                    <Text
                      style={{
                        marginLeft: 15,
                        fontSize: 15,
                        fontWeight: "600",
                        color:
                          theme === "dark"
                            ? clockInLoading
                              ? Colors.dark.tetiary
                              : "#fff"
                            : clockInLoading
                            ? Colors.dark.tetiary
                            : "#424242",
                      }}
                    >
                      {isAlreadyClockedIn ? "View clocked in time" : "Clock In"}
                    </Text>
                    {clockInLoading && (
                      <View style={[styles.transBg, { paddingLeft: 30 }]}>
                        <ActivityIndicator />
                      </View>
                    )}
                  </InvTouchableOpacity>
                )}
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
        {!isBottomSheetVisible && !clockIn && (
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
            onPress={handlePlusIconPressed}
            darkColor="#0c0c0c"
          >
            <AntDesign
              name="plus"
              color={
                theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple
              }
              size={18}
              style={{ fontWeight: "bold" }}
            />
          </InvTouchableOpacity>
        )}
        {clockIn && user && (
          <ClockInSheet
            startTime={route.params.classStartTime.toDate()}
            endTime={route.params.classEndTime.toDate()}
            classId={route.params.uid}
            userId={user.uid}
            clockedInTimestamp={userData?.clockInDate}
            setClockIn={setClockIn}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
