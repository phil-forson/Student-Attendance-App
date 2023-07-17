import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { InvTouchableOpacity, Text, View } from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";

const SettingsScreen = ({ navigation }: any) => {
  const theme = useColorScheme();
  return (
    <SafeAreaView>
      <View
        style={[
          {
            justifyContent: "space-between",
          },
        ]}
      >
        <InvTouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome5
            name="bars"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </InvTouchableOpacity>
        <View></View>
      </View>
      <Text>Settings</Text>
    </SafeAreaView>
  );
};

export default SettingsScreen;
