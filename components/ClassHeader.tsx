import React from "react";
import useColorScheme from "../hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvTouchableOpacity, Text, View } from "./Themed";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

export default function ClassHeader({ navigation }: any) {
  const theme = useColorScheme();

  return (
    <>
    <TouchableOpacity></TouchableOpacity>
    </>
  );
}


