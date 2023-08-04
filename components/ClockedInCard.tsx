import CircularProgress from "react-native-circular-progress-indicator";
import Colors from "../constants/Colors";
import { styles } from "../styles/styles";
import { View, Text, TouchableOpacity } from "./Themed";
import React, { useEffect, useRef, useState } from "react";
import {
  calculateDurationInSeconds,
  convertToDayString,
  convertToHHMM,
  getValueFor,
} from "../utils/utils";
import FullWidthButton from "./FullWidthButton";
import useClass from "../hooks/useClass";
import { ActivityIndicator, AppState, AppStateStatus } from "react-native";
import useAuth from "../hooks/useAuth";
import { userClockOut } from "../utils/helpers";
import ClockInSheet from "./ClockInSheet";
import { Alert } from "react-native";

export default function ClockedInCard({
  classId,
  navigation,
}: {
  classId: string;
  navigation: any;
}) {
  const { classData, isLoading: isClassDataLoading } = useClass(classId);
  const [seconds, setSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);

  const { user } = useAuth();

  const appState = useRef(AppState.currentState);

  const [timerActive, setTimerActive] = useState(true);

  let duration = 0;

  useEffect(() => {
    if (classData) {
      duration = calculateDurationInSeconds(
        classData?.classStartTime.toDate(),
        classData.classEndTime.toDate()
      );
    }
  }, [classData]);

  useEffect(() => {
    const unsubscribe = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => unsubscribe.remove();
  }, []);

  useEffect(() => {
    fetchAndSetClockInTime();

    // Start the timer when the component mounts
    console.log("starting timer...");
    const interval = setInterval(() => {
      setInitialSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      if (timerActive && user && initialSeconds >= duration) {
        userClockOut(user.uid, classId);
      }
      clearInterval(interval);
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("background...");
      // We just became active again: recalculate elapsed time based
      // on what we stored in AsyncStorage when we started.
      fetchAndSetClockInTime();
    }
    appState.current = nextAppState;
  };

  const getElapsedTime = async () => {
    try {
      const clockInDateStr = await getValueFor("clockIn");
      if (clockInDateStr) {
        const clockInDate = new Date(clockInDateStr);
        const currentTime = new Date();
        const elapsedSeconds = Math.floor(
          (currentTime.getTime() - clockInDate.getTime()) / 1000
        );
        return elapsedSeconds;
      }
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const fetchAndSetClockInTime = async () => {
    const elapsed = await getElapsedTime();

    console.log("total seconds ", duration);

    console.log("elapsed ", elapsed);
    // Update the elapsed seconds state
    setInitialSeconds(elapsed ?? 0);
  };

  const handleClockOut = () => {
    try {
      if (user) {
        userClockOut(user?.uid, classId);
      }
    } catch (error) {
      Alert.alert("Error", "Something unexpected happened");
    }
  };

  const formatTime = (timeSeconds: number) => {
    "worklet";

    const seconds = initialSeconds;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format the time as "hh:mm:ss" or "mm:ss" if hours is 0
    const formattedTime =
      hours > 0
        ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(remainingSeconds).padStart(2, "0")}`
        : `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
          ).padStart(2, "0")}`;

    return formattedTime;
  };
  return (
    <>
      <TouchableOpacity
        style={[
          { height: 150, paddingVertical: 30, paddingHorizontal: 20 },
          styles.rounded,
        ]}
        darkColor={Colors.dark.secondaryGrey}
        lightColor={Colors.light.primaryGrey}
        onPress={() => {
          if (classData && user) {
            navigation.navigate("ClassDetails", classData);
            console.log(classData);
          }
        }}
      >
        {!isClassDataLoading ? (
          <View style={[styles.transBg, styles.flexRow, styles.justifyBetween]}>
            <View style={[styles.transBg, styles.justifyBetween]}>
              <Text
                style={[
                  styles.bold,
                  {
                    color: Colors.dark.tetiary,
                  },
                ]}
              >
                {classData?.courseTitle}{" "}
              </Text>
              <Text
                style={[
                  styles.bold,
                  styles.my,
                  {
                    color: Colors.dark.tetiary,
                  },
                ]}
              >
                {classData?.classTitle}
              </Text>
              <Text
                style={[
                  styles.bold,
                  {
                    color: Colors.dark.tetiary,
                  },
                ]}
              >
                {convertToDayString(
                  classData?.classEndTime.toDate() ?? new Date()
                )}
              </Text>
            </View>
            <CircularProgress
              value={initialSeconds}
              maxValue={duration}
              radius={45}
              duration={duration} // 2 minutes in milliseconds
              title={convertToHHMM(new Date(Date.now()))}
              titleFontSize={10}
              progressValueFontSize={15}
              progressFormatter={formatTime}
            />
          </View>
        ) : (
          <View
            style={[
              styles.transBg,
              styles.justifyCenter,
              styles.itemsCenter,
              styles.flexOne,
            ]}
          >
            <ActivityIndicator />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}
