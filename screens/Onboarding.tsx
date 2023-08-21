import { View, Text, SafeAreaView } from "../components/Themed";
import { Image, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import FullWidthButton from "../components/FullWidthButton";
import { RootStackParamList, RootStackScreenProps } from "../types";
import Colors from "../constants/Colors";

export default function Onboarding({navigation}: RootStackScreenProps<"Root">) {
  const theme = useColorScheme();
  return (
    <SafeAreaView style={[styles.container]}>
      <Image source={require("../assets/globe.png")} style={[styles.image]} />
      <View style={[styles.subContainer]}>
        <Text style={[styles.mainText]}>Discover Presensa</Text>
        <Text style={[styles.subText]}>Your smart attendance solution</Text>

        <View style={[styles.signIn]}>
          <FullWidthButton
            text={"Log In"}
            style={{ borderRadius: 50, height: 55, backgroundColor: theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple }}
            onPress={() => navigation.navigate("LogIn")}
          />
          <FullWidthButton
            text={"Create An Account"}
            style={{
              borderRadius: 50,
              backgroundColor: theme === "dark" ? "#302e2e" : "#f8f8fd",
              height: 55,
            }}
            textStyle={{ color: theme === "dark" ? "#fff" : "black" }}
            onPress={()=> navigation.navigate("PersonalInfo")}
          />
          <Text style={[styles.textCenter]}>
            By signing in you accept our{" "}
            <Text style={[styles.blueText]}>Terms and Conditions</Text> and{" "}
            <Text style={[styles.blueText]}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ['#fff', '#6C7BFF', '#FF00D6', '#0500FF', '#6AB8FF']
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: 400,
    width: 400,
    margin: "auto",
  },
  mainText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "700",
  },
  subText: {
    textAlign: "center",
    fontSize: 15,
  },
  signIn: {
    marginTop: 30,
  },
  textCenter: {
    textAlign: "center",
  },
  blueText: {
    color: "#1c95f1",
  },
});
