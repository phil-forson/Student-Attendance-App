import { View, Text, SafeAreaView } from "../components/Themed";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import StyledInput from "../components/StyledInput";
import FullWidthButton from "../components/FullWidthButton";
import { RootStackScreenProps } from "../types";

const width = Dimensions.get("screen").width;
export default function PersonalInfo({
  navigation,
}: RootStackScreenProps<"PersonalInfo">) {
  const [firstName, setFirstName] = useState("");
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameValid, setLastNameValid] = useState(false);

  const handleFirstName = (firstName: string) => {
    setFirstName(firstName);
    setFirstNameValid(firstName.length > 1);
  };

  const handleLastName = (lastName: string) => {
    setLastName(lastName);
    setLastNameValid(lastName.length > 1);
  };

  const handleContinue = () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
    };

    if (!Object.values(data).every(Boolean)) {
      return;
    }

    navigation.navigate("UniversityDetails", data);
  };
  return (
    <SafeAreaView style={[styles.container]}>
      <View
        style={[
          styles.subContainer,
          { paddingVertical: Platform.OS === "ios" ? 40 : 60 },
        ]}
      >
        <View>
          <View style={[styles.headerView]}>
            <View style={[styles.headerSection]}>
              {/* <View style={[styles.iconContainer]}></View> */}
              <Text style={[styles.headerMainText]}>Personal Information</Text>
              <View></View>
            </View>
            <Text style={[styles.headerSubText]}>
              Let's start with your personal information. Please provide your
              first name and last name.
            </Text>
            {/* <Image source={require("../assets/personalInfo.png")} style={[styles.image]}/> */}
          </View>
          <View style={[styles.inputFields]}>
            <View style={[styles.my]}>
              <Text style={[styles.label]}>First Name</Text>
              <StyledInput
                value={firstName}
                setValue={handleFirstName}
                secure={false}
                keyboardType="default"
                placeholder="First Name"
                placeholderTextColor = "gray"
              />
            </View>
            <View style={[styles.my]}>
              <Text style={[styles.label]}>Last Name</Text>
              <StyledInput
                value={lastName}
                setValue={handleLastName}
                secure={false}
                placeholderTextColor = "gray"
                keyboardType="default"
                placeholder="Last Name"
              />
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FullWidthButton
            text={"Continue"}
            onPress={handleContinue}
            disabled={!(firstNameValid && lastNameValid)}
            style={{ borderRadius: 50, paddingHorizontal: 10 }}
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
  image: {
    height: 200,
    width: 200,
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    flex: 1,
    justifyContent: "space-between",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerView: {},
  headerMainText: {
    fontSize: 30,
    fontWeight: "700",
  },
  headerSubText: {
    marginTop: 10,
    fontSize: 15,
  },
  iconContainer: {
    position: "absolute",
    height: 190,
    width: 190,
    left: width - 400,
    borderRadius: 100,
    backgroundColor: "orange",
  },
  inputFields: {
    marginTop: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  my: {
    marginVertical: 10,
  },
});
