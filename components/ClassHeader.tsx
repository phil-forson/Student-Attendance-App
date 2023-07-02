import React from "react";
import useColorScheme from "../hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvTouchableOpacity, Text, View } from "./Themed";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function ClassHeader({ navigation }: any) {
  const theme = useColorScheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#121212" : "#fff",
        },
      ]}
    >
      <View>
        <InvTouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </InvTouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginVertical: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bold: {
    fontWeight: "700",
    fontSize: 15,
  },
  shadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    marginBottom: 0,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  circle: {
    borderRadius: 50,
    padding: 15,
  },
});
