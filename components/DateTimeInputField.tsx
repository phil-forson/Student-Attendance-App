import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { View, Text, TextInput } from "./Themed";
import React, { useState, useRef } from "react";

export type Props = {
  setValue: any;
  value: string;
  valid: boolean;
  placeholder: string;
  placeholderTextColor: string
  onClick:  () => void
};

export default function DateTimeInputField({ value, setValue, valid, placeholder, placeholderTextColor, onClick }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [textChanged, setTextChanged] = useState(false);
  const inputRef = useRef()

  
  return (
    <TouchableWithoutFeedback onFocus={onClick} onPress={onClick}>
      <TextInput
        style={{
          height: 40,
          paddingLeft: 0,
          paddingRight: 50,
          borderWidth: 0,
          borderBottomWidth: 1,
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
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCapitalize={"none"}
        onFocus={() => {
          setIsFocused(true);
          setIsBlur(false);
        }}
        onBlur={() => {
          setIsFocused(false);
          setIsBlur(true);
        }}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          setTextChanged(true);
        }}
        autoFocus={true}
        editable={false}
      />
    </TouchableWithoutFeedback>
  );
}
