import React, { useContext, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputKeyPressEventData,
  useColorScheme,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../components/InputField";
import { Text, TouchableOpacity, View } from "../components/Themed";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";
import { UserContext } from "../contexts/UserContext";

const width = Dimensions.get("screen").width;

const VerifyCodeScreen = ({
  navigation,
  route
}: RootStackScreenProps<"VerifyCode">) => {
  const theme = useColorScheme();
  const { setUserLoggedIn } = useContext(UserContext);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [textChanged, setTextChanged] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<any>([]);

  const handleOtpChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    // Move focus to the next input box
    if (text.length > 0 && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (updatedOtp.every((digit) => digit !== '')) {
      const fullOtp = updatedOtp.join('');
      handleVerifyOtp(fullOtp);
    }
  };

  const handleVerifyOtp = (otp: string) => {
    console.log(route.params)
    console.log(otp)
    setUserLoggedIn(true);
  }

  

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#fff" : "#000",
        },
      ]}
    >
      <View
        style={{
          marginTop: 30,
        }}
      >
        <Text style={styles.headerMainText}>Email Verification</Text>
        <Text
          style={[
            styles.headerSubText,
            styles.my,
            {
              fontSize: 20,
            },
          ]}
        >
          Enter the verification code sent to your email account.
        </Text>
      </View>
      <View style={{}}>
        <Text
          style={{
            color: "#7b7676",
          }}
        >
          An email has been sent to the account you provided. Provide the code
          sent in that account
        </Text>
      </View>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.input,
              { backgroundColor: theme === "dark" ? "#302e2e" : "#f1f1f2", color: theme === 'dark'? 'gray': 'black' },
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            // onKeyPress={(event) => handleOtpKeyPress(event, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.bottom}>
        <TouchableOpacity
          style={[
            {
              width: "auto",
              marginVertical: 15,
              paddingHorizontal: 15,
              height: 40,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor:
                code === "" ? "#878383" : theme === "light" ? "#000" : "#fff",
            },
          ]}
          disabled={code === ""}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          <Text
            lightColor="#fff"
            darkColor="#000"
            style={{
              fontWeight: "bold",
            }}
          >
            Change Password
          </Text>
          <AntDesign
            name="arrowright"
            size={20}
            color={theme === "light" ? "white" : "black"}
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  headerMainText: {
    fontSize: 30,
    fontWeight: "700",
  },
  headerSubText: {
    marginTop: 10,
    fontSize: 20,
  },
  my: {
    marginVertical: 10,
  },
  bottom: {
    marginBottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: {
    width: 60,
    height: 60,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    fontSize: 24,
    textAlign: "center",
  },
});

export default VerifyCodeScreen;
