import { useColorScheme } from "react-native";
import { Text, TouchableOpacity } from "./Themed";
import React, { useEffect } from "react";

export type Props = {
  onPress?: () => any;
  disabled?: boolean;
  text: any;
};

export default function FullWidthButton({
  onPress,
  text,
  disabled = false,
}: Props) {
  useEffect(()=> {
    console.log('disabled changed to ', disabled)
  }, [disabled])
  return (
    <TouchableOpacity
      style={{
        width: "auto",
        marginVertical: 15,
        height: 45,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        opacity: disabled ? 0.32 : 1,
      }}
      disabled={disabled}
      onPress={onPress}
    >
      <Text lightColor="#fff" darkColor="#000" style={[{ fontWeight: "700" }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
