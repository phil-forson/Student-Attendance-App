import { Text, TouchableOpacity } from "./Themed";
import React from "react";

export type Props = {
  onPress?: () => any;
  text: string;
};

export default function FullWidthButton({ onPress, text }: Props) {
  return (
    <TouchableOpacity
      style={{
        width: "auto",
        marginVertical: 15,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Text lightColor="#fff" darkColor="#000">{text}</Text>
    </TouchableOpacity>
  );
}
