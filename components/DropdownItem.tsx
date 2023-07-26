import { useColorScheme } from "react-native";
import { View, Text, TouchableOpacity } from "./Themed";
import React from "react";
import Colors from "../constants/Colors";

type Props = {
    handlePress: any,
    item: string
}
export default function DropdownItem({ handlePress, item }: Props) {
  const theme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={handlePress}
      darkColor={Colors.dark.secondaryGrey}
      lightColor={Colors.light.secondaryGrey}
      style={[
        {
          padding: 10,
          height: 55,
          justifyContent: "center",
        },
      ]}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );
}
