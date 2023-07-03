import { View, Text, TextInput } from "./Themed";
import React, { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, useColorScheme } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export type Props = {
  placeholderTextColor?: string;
  placeholder: string;
  secure: boolean;
  keyboardType: KeyboardTypeOptions;
  value: string;
  setValue: any;
  valid?: boolean;
  instructions?: string;
  icon?: keyof typeof AntDesign.glyphMap;
  editable?: boolean;
  onClick?: () => void;
  caretHidden?: boolean;
};

export default function StyledInput({
  placeholderTextColor,
  placeholder,
  secure,
  keyboardType,
  value,
  setValue,
  valid,
  instructions,
  icon,
  editable,
  onClick,
  caretHidden,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [textChanged, setTextChanged] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(secure);
  const theme = useColorScheme();

  return (
    <View>
      <TextInput
        style={{
          height: 50,
          paddingHorizontal: 20,
          borderWidth: 0,

          backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2",
          borderRadius: 4,
          borderColor: isFocused
            ? textChanged
              ? valid
                ? "#0083eb"
                : valid === undefined
                ? "#0083eb"
                : "red"
              : "#0083eb"
            : isBlur
            ? textChanged
              ? valid
                ? "#C7C7CD"
                : valid === undefined
                ? "#c7c7cd"
                : "red"
              : "#C7C7CD"
            : "#C7C7CD",
        }}
        autoCapitalize={"none"}
        secureTextEntry={isPasswordSecure}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCorrect={false}
        caretHidden={caretHidden}
        autoComplete={keyboardType === "email-address" ? "email" : undefined}
        onFocus={() => {
          setIsFocused(true);
          setIsBlur(false);
          if (onClick) {
            onClick();
          }
        }}
        onBlur={() => {
          setIsFocused(false);
          setIsBlur(true);
          console.log("blurred");
        }}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          setTextChanged(true);
        }}
        editable={editable}
        onPressIn={onClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
