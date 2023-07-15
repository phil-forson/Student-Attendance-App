import { View, Text } from "../components/Themed";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import FullWidthButton from "../components/FullWidthButton";
import { RootStackScreenProps } from "../types";

export default function EmailVerificationSent({
  navigation,
}: RootStackScreenProps<"EmailVerification">) {
  const theme = useColorScheme();

  const handleContinue = () => {
    navigation.navigate("FacialRecognition");
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000" : "#fff" },
      ]}
    >
      <View style={[styles.subContainer]}>
        <View style={[styles.headerView]}>
          <View style={[styles.headerMainText]}>
            <Entypo
              name="mail"
              size={24}
              color={theme === "dark" ? "white" : "black"}
              style={[{ marginRight: 20 }]}
            />
            <Text style={[{ fontSize: 30, fontWeight: "700" }]}>
              Email Verification
            </Text>
          </View>
          <Text style={[styles.headerSubText]}>
            Email has been sent to your email address, go to your email and do
            well to check the spam if you don't see it
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.bottom}
        >
          <FullWidthButton
            text={"Continue"}
            onPress={handleContinue}
            style={{ paddingHorizontal: 10 }}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    flex: 1,
  },
  headerView: {},
  headerMainText: {
    fontSize: 30,
    fontWeight: "700",
    flexDirection: "row",
    alignItems: "center",
  },
  headerSubText: {
    marginTop: 10,
    fontSize: 15,
  },
  my: {
    marginVertical: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 0,
  },
});
