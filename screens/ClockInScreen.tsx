import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import { View, Text } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

export default function ClockInScreen({ navigation, route }: any) {
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const isFocused = useIsFocused();
  const [hours, setHours] = useState()

  const getData = () => {
    setIsLoading(true);
    setData(route.params);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("clock in route", route.params);
    getData()
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
      <View>
        <Text style={[styles.textCenter, styles.largeText]}>00:00:00</Text>
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
  largeText: {
    fontSize: 70,
  },
});
