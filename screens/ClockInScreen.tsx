import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  Platform,
  ActivityIndicator,
  Button,
} from "react-native";
import { View, Text } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export default function ClockInScreen({ navigation, route }: any) {
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const isFocused = useIsFocused();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<any>(null);
  const [progress, setProgress] = useState(0);


  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  const getData = () => {
    setIsLoading(true);
    setData(route.params);
    setIsLoading(false);
  };

  // const calculateTime = () => {

  //       const startTime = new Date(Date.now());
  //       const endTime = new Date(route.params?.class.classEndTime.toDate());
  //       const diff = Math.abs(endTime.getTime() - startTime.getTime());

  //       // Calculate hours, minutes, and seconds
  //       const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');;
  //       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
  //       const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

  //       setHours(hours)
  //       setMinutes(minutes)
  //       setSeconds(seconds)

  //       console.log("hours ", hours);
  //       console.log("minutes ", minutes);
  //       console.log("seconds ", seconds);
  // };

  useEffect(() => {
    console.log("clock in route", route.params);
    getData();
  }, [isFocused]);

  useEffect(() => {
    let intervalId: any;

    // Start the timer
    const startTimer = () => {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    };

    // Start the timer when the component mounts
    startTimer();

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update minutes and hours based on the current seconds value
    if (seconds === 60) {
      setSeconds(0);
      setMinutes((prevMinutes) => prevMinutes + 1);
    }
    if (minutes === 60) {
      setMinutes(0);
      setHours((prevHours) => prevHours + 1);
    }

    const calculateProgress = () => {
      const endTime = route.params?.class.classEndTime?.toDate().getTime();
      const now = Date.now();
      const diff = Math.max(endTime - now, 0);
      const progress = (1 - diff / (60 * 60 * 1000)) * 100; // Calculate progress percentage
      return progress;
    };

    setProgress(calculateProgress());
  }, [seconds]);



  const renderProgressCircle = () => {
    return (
      <Svg width={200} height={200}>
        <Circle
          cx={100}
          cy={100}
          r={90}
          fill="transparent"
          stroke="#ccc"
          strokeWidth={15}
        />
        <Circle
          cx={100}
          cy={100}
          r={90}
          fill="transparent"
          stroke="#007AFF"
          strokeWidth={15}
          strokeDasharray={`${progress} ${100 - progress}`}
          transform={`rotate(-90 100 100)`}
        />
      </Svg>
    );
  };

  if (!data) {
    return <ActivityIndicator />;
  }
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#121212" : "#eee",
          paddingTop: Platform.OS === "ios" ? 0 : 30,
        },
      ]}
    >
      <View>
      {renderProgressCircle()}
      <Text style={[styles.textCenter, styles.largeText]}>
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Text>
      <Text style={[styles.mediumText, { alignItems: "center" }]}>
        <Ionicons
          name="alarm-outline"
          size={30}
          color={theme === "light" ? "black" : "white"}
          />{" "}
        {new Date(route.params.class.classEndTime?.toDate()).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
          )}
      </Text>
      <Button
        title={
          isRegistered
          ? "Unregister BackgroundFetch task"
          : "Register BackgroundFetch task"
        }
        onPress={toggleFetchTask}
        />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  mediumText: {
    fontSize: 30,
  },
  largeText: {
    fontSize: 70,
  },
});
