import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { KeyboardTypeOptions } from "react-native/types";
import { Text, TextInput, View } from "./Themed";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

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
  editable?:boolean
  onClick?: () => void
};

export const InputField = ({
  placeholderTextColor,
  placeholder,
  secure,
  keyboardType,
  value,
  setValue,
  valid,
  instructions,
  icon,
  editable=true,
  onClick
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [textChanged, setTextChanged] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(secure);
  const theme = useColorScheme();
  return (
    <View>
      {icon && (
        <View style={styles.iconContainer}>
          <View style={[styles.icon, styles.front]}>
            <AntDesign
              size={20}
              name={icon}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
        </View>
      )}
      <TextInput
        style={{
          height: 40,
          paddingLeft: icon ? 30 : 0,
          paddingRight: 50,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 4,
          borderColor: isFocused
            ? textChanged
              ? valid
                ? "#0083eb" :
                valid === undefined ? '#0083eb'
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
        autoComplete={keyboardType === "email-address" ? "email" : undefined}
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
        editable={editable}
        onPressIn={onClick}
      />
      {secure && (
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.icon,
              styles.end,
              {
                right:
                  (textChanged && !valid) || (textChanged && valid) ? 40 : 10,
              },
            ]}
          >
            <Feather
              name={isPasswordSecure ? "eye-off" : "eye"}
              size={20}
              onPress={() => setIsPasswordSecure(!isPasswordSecure)}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
        </View>
      )}
      {textChanged && valid !== undefined && (
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.icon,
              styles.end,
              {
                right: 10,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={24}
              color="green"
            />
          </View>
        </View>
      )}
      {textChanged && !valid && valid !== undefined && (
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.icon,
              styles.end,
              {
                right: 10,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-decagram"
              size={24}
              color="red"
            />
          </View>
        </View>
      )}
      {textChanged && !valid && <View></View>}
      {textChanged && !valid && instructions && (
        <Text
          lightColor="red"
          darkColor="red"
          style={{
            fontSize: 10,
            paddingLeft: 2,
          }}
        >
          {instructions}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    zIndex: 1,
  },
  icon: {
    zIndex: 9999,
    position: "absolute",
  },
  front: {
    top: 10,
  },
  end: {
    top: -30,
  },
});
