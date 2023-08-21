import { View, Text, Pressable, useColorScheme } from "react-native";
import React from "react";
import { ViewStyle } from "react-native";
import Colors from "../constants/Colors";
import { styles } from "../styles/styles";

type Props = {
  active: boolean;
  text: string;
  styleProps?: ViewStyle;
  onPress: () => void;
};
export default function TopTabBar({ active, text, styleProps, onPress }: Props) {
  const theme = useColorScheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.h30,
        styles.flexOne,
        {
          borderBottomColor:
            theme === "dark"
              ? active
                ? Colors.deSaturatedPurple
                : Colors.dark.primaryGrey
              : active
              ? Colors.mainPurple
              : Colors.light.primaryGrey,
          borderBottomWidth: 3,
        },
        styleProps,
      ]}
    >
      <Text
        style={[
          {
            textAlign: "center",
            color:
              theme === "dark"
                ? active
                  ? Colors.deSaturatedPurple
                  : "white"
                : active
                ? Colors.mainPurple
                : "black",
            fontWeight: active ? "bold" : "normal",
          },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
