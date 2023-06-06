import { View, Text } from "./Themed";
import React, {useEffect} from "react";
import { StyleSheet, Image } from "react-native";

export default function UserListCard({ text }: any) {

   
    
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/profileimg.png")}
        style={styles.imgStyle}
      />
      <Text style={styles.textStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  imgStyle: {
    height: 35,
    width: 35,
  },
  textStyle: {
    marginLeft: 40,
  },
});
