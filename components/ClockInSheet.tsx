import { View, Text } from "./Themed";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { styles, width } from "../styles/styles";
import {
  Alert,
  useColorScheme,
  AppState,
  AppStateEvent,
  AppStateStatus,
} from "react-native";
import Colors from "../constants/Colors";
import CircularProgress from "react-native-circular-progress-indicator";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  calculateDuration,
  calculateDurationInSeconds,
  convertToHHMM,
  getValueFor,
  isTimePast,
} from "../utils/utils";
import { userClockOut } from "../utils/helpers";
import FullWidthButton from "./FullWidthButton";
import { useIsFocused } from "@react-navigation/native";
import { Timestamp } from "firebase/firestore";

export default function ClockInSheet({
  startTime,
  endTime,
  userId,
  classId,
  setClockIn,
  clockedInTimestamp,
}: {
  startTime: Date;
  endTime: Date;
  userId: string;
  classId: string;
  setClockIn: React.Dispatch<React.SetStateAction<boolean>>;
  clockedInTimestamp: Timestamp;
}) {
  const theme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const appState = useRef(AppState.currentState);

  const duration = calculateDurationInSeconds(new Date(Date.now()), endTime);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [seconds, setSeconds] = useState(0);

  const [initialSeconds, setInitialSeconds] = useState(0);

  const [timerActive, setTimerActive] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => unsubscribe.remove();
  }, []);

  useEffect(() => {
    console.log("is focused ", isFocused);
  }, [isFocused]);

  useEffect(() => {
    fetchAndSetClockInTime();

    // Start the timer when the component mounts
    const interval = setInterval(() => {
      setInitialSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      if (timerActive && endTime && isTimePast(endTime)) {
        userClockOut(userId, classId, endTime);
      }
      clearInterval(interval);
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // We just became active again: recalculate elapsed time based
      // on what we stored in AsyncStorage when we started.
      fetchAndSetClockInTime();
    }
    appState.current = nextAppState;
  };

  const getElapsedTime = async () => {
    try {
      const clockInDateStr = clockedInTimestamp?.toDate();
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

    // Update the elapsed seconds state
    setInitialSeconds(elapsed ?? 0);
  };

  const handleClockOut = () => {
    try {
      userClockOut(userId, classId);
      setClockIn(false);
    } catch (error) {
      Alert.alert("Error", "Something unexpected happened");
    }
  };

  const formatTime = (timeSeconds: number) => {
    "worklet";

    const totalSeconds = initialSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

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
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        index={2}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor:
            theme === "dark"
              ? Colors.dark.primaryGrey
              : Colors.light.background,
        }}
      >
        <View
          style={[
            styles.contentContainer,
            styles.transBg,
            styles.itemsCenter,
            { paddingTop: 80 },
          ]}
        >
          <CircularProgress
            value={initialSeconds}
            maxValue={duration}
            radius={130}
            duration={duration} // 2 minutes in milliseconds
            title={convertToHHMM(endTime)}
            titleFontSize={20}
            activeStrokeColor={theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple}
            progressValueColor={theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple}
            titleColor={theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple}
            progressValueFontSize={50}
            dashedStrokeConfig={{
              count: 50,
              width: 4,
            }}
            progressFormatter={formatTime}
          />

          <View style={[styles.transBg, styles.mmy, { width: 200 }]}>
            <FullWidthButton
              text={"Clock Out"}
              onPress={() => {
                Alert.alert(
                  "Clock Out",
                  "Do you want to continue to clock out?",
                  [
                    {
                      text: "No",
                    },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: handleClockOut,
                    },
                  ]
                );
              }}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? Colors.deSaturatedPurple
                    : Colors.mainPurple,
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </>
  );
}
