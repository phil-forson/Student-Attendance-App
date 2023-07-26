import { View, Text } from "./Themed";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { styles } from "../styles/styles";
import { Alert, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import CircularProgress from "react-native-circular-progress-indicator";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { calculateDuration, calculateDurationInSeconds, convertToHHMM } from "../utils/utils";
import { userClockOut } from "../utils/helpers";

export default function ClockInSheet({startTime, endTime, userId, classId}: {startTime: Date, endTime: Date, userId: string, classId: string}) {
  const theme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const duration = calculateDurationInSeconds(startTime, endTime)


  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Start the timer when the component mounts
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
        userClockOut(userId, classId)
        clearInterval(interval)};
  }, []);



  const formatTime = (timeSeconds: number) => {
    "worklet";

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
      <BottomSheet
        ref={bottomSheetRef}
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
            value={seconds}
            maxValue={duration}
            radius={130}
            duration={duration} // 2 minutes in milliseconds
            title={convertToHHMM(endTime)}
            titleFontSize={20}
            progressValueFontSize={50}
            dashedStrokeConfig={{
              count: 50,
              width: 4,
            }}
            progressFormatter={formatTime}
          />
        </View>
      </BottomSheet>
    </>
  );
}
