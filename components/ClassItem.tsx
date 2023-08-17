import React from "react";
import { Pressable } from "react-native";
import { styles } from "../styles/styles";
import { Text } from "./Themed";
import { convertToHHMM } from "../utils/utils";

export const ClassItem = ({ item, handleClassItemPressed }: any) => {
    return (
      <Pressable
        style={[styles.transBg, { padding: 20 }]}
        onPress={() => handleClassItemPressed(item.uid)}
      >
        <Text style={[styles.semiBold]}>{item.classTitle}</Text>
        <Text>
          {item?.classLocation.description.split(",").slice(0, 2).join(",")}
        </Text>
        <Text>
          {convertToHHMM(item?.classStartTime?.toDate())} -{" "}
          {convertToHHMM(item?.classEndTime?.toDate())}
        </Text>
        {/* Other properties */}
      </Pressable>
    );
  };