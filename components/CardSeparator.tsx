import { StyleProp, ViewStyle } from "react-native";
import { View, Text } from "./Themed";
import React from "react";

export type Props = {
  viewStyle: StyleProp<ViewStyle>;
};

export default function CardSeparator({ viewStyle }: Props) {
  return (
    <View style={viewStyle}>
      <Text></Text>
    </View>
  );
}
