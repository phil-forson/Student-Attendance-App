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
import Svg, { Circle } from "react-native-svg"
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch'

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
  
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
  
    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

export default function ClockInScreen({ navigation, route }: any) {
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const isFocused = useIsFocused();
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<any>(null);

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
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
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

  const calculateTime = () => {

        const startTime = new Date(Date.now());
        const endTime = new Date(route.params?.class.classEndTime.toDate());
        const diff = Math.abs(endTime.getTime() - startTime.getTime());
  
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');;
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
    
        console.log("hours ", hours);
        console.log("minutes ", minutes);
        console.log("seconds ", seconds);
  };
  useEffect(() => {
    console.log("clock in route", route.params);
    getData();

    const interval = setInterval(() => {
        calculateTime()
    }, 1000)

    if(!isFocused){
        clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isFocused]);

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
      {/* <Svg> */}
        {/* <Circle /> */}
        <Text style={[styles.textCenter, styles.largeText]}>{hours}:{minutes}:{seconds}</Text>
      {/* </Svg> */}
      <Button
        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
        onPress={toggleFetchTask}
      />
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
  largeText: {
    fontSize: 70,
  },
});
