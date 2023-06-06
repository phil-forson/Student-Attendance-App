import { View, Text, InvTouchableOpacity } from "../components/Themed";
import { SafeAreaView, StyleSheet, Platform } from "react-native";
import React, { useEffect } from "react";
import useColorScheme from "../hooks/useColorScheme";
import { FontAwesome5 } from "@expo/vector-icons";
import UserListCard from "../components/UserListCard";

export default function CourseMembersScreen({ navigation, route }: any) {
  const theme = useColorScheme();

  useEffect(() => {
    console.log("route ", route);
  }, []);
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#121212" : "#eee",
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <InvTouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
            paddingVertical: 10,
          }}
        >
          <FontAwesome5
            name="bars"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </InvTouchableOpacity>
      </View>
      <View style={[{ paddingHorizontal: Platform.OS === 'ios' ? 20: 0}]}>
        <Text
          style={[
            { fontSize: 22, borderBottomColor: "gray", borderBottomWidth: 1 },
          ]}
        >
          Lecturer Name
        </Text>
        <UserListCard text={"Boakye"} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
});
