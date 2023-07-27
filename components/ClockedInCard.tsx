import CircularProgress from "react-native-circular-progress-indicator";
import Colors from "../constants/Colors";
import { styles } from "../styles/styles";
import { View, Text, TouchableOpacity } from "./Themed";
import React, { useEffect, useState } from "react";
import { convertToDayString, convertToHHMM } from "../utils/utils";
import FullWidthButton from "./FullWidthButton";
import useClass from "../hooks/useClass";
import { ActivityIndicator } from "react-native";
import useAuth from "../hooks/useAuth";
import { userClockOut } from "../utils/helpers";

export default function ClockedInCard({ classId }: { classId: string }) {
  const { classData, isLoading: isClassDataLoading } = useClass(classId);
  const [seconds, setSeconds] = useState(0);

  const { user } = useAuth();

  const duration = 120;

  useEffect(() => {
    // Start the timer when the component mounts
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
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
    <TouchableOpacity
      style={[
        { height: 150, paddingVertical: 30, paddingHorizontal: 20 },
        styles.rounded,
      ]}
      darkColor={Colors.dark.secondaryGrey}
      lightColor={Colors.light.primaryGrey}
      onPress={() => {
        if (user) {
          userClockOut(user?.uid, classId);
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
            value={seconds}
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
  );
}
