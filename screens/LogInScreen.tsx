import React, { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, StyleSheet, Alert } from "react-native";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../components/InputField";
import {
  InvTouchableOpacity,
  Text,
  TouchableOpacity,
  View,
} from "../components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";
import { KeyboardAvoidingView } from "react-native";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { APIKEY } from "@env";
import { UserContext } from "../contexts/UserContext";
import StyledInput from "../components/StyledInput";
import FullWidthButton from "../components/FullWidthButton";
import Colors from "../constants/Colors";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LogInScreen = ({ navigation }: RootStackScreenProps<"LogIn">) => {
  const { setUserLoggedIn } = useContext(UserContext);
  const theme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleEmail = (email: string) => {
    setValidEmail(EMAIL_REGEX.test(email));
    setEmail(email);
  };

  const handlePwd = (pwd: string) => {
    setMatchPwd(PWD_REGEX.test(pwd));
    setPwd(pwd);
  };

  const handleSubmit = () => {
    if (validEmail && matchPwd) {
      setIsLoading(true);
      logIn();
    } else {
      Alert.alert("Invalid", "Invalid Details!");
    }
  };

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pwd)
        .then((res) => {
          if (res.user.emailVerified) {
            setUserLoggedIn(true);
          } else {
            Alert.alert(
              "Account Verification",
              "Your account has not been verified. Check your email to verify your account before proceeding."
            );
          }
        })
        .finally(() => setIsLoading(false));
    } catch (error: any) {
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Your email or password was incorrect");
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert("An account with this email already exists");
      } else {
        console.log(error);
        Alert.alert("There was a problem with your request");
      }
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#fff" : "#000",
        },
      ]}
    >
      <View style={[styles.headerView]}>
        <Text style={[styles.headerMainText]}>Enter Your Details</Text>
      </View>
      <View style={styles.my}>
        <Text style={[styles.label]}>Email Address</Text>
        <StyledInput
          value={email}
          setValue={handleEmail}
          secure={false}
          keyboardType="email-address"
          placeholder="Email address"
        />
      </View>
      <View style={styles.my}>
        <Text style={[styles.label]}>Password</Text>
        <StyledInput
          value={pwd}
          setValue={handlePwd}
          secure={true}
          keyboardType="default"
          placeholder="Password"
        />
      </View>
      <View style={[styles.bottom]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[{}]}
        >
          <FullWidthButton
            text={"Log In"}
            onPress={handleSubmit}
            disabled={!(matchPwd && validEmail) || isLoading}
            style={{ borderRadius: 50, paddingHorizontal: 10, backgroundColor: theme === "dark" ? Colors.deSaturatedPurple : Colors.mainPurple }}
          />
        </KeyboardAvoidingView>

        <InvTouchableOpacity
          style={[
            {
              alignItems: "flex-end",
            },
          ]}
          onPress={() => navigation.navigate("PersonalInfo")}
        >
          <Text>New here? Sign Up</Text>
        </InvTouchableOpacity>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  bold: {
    fontWeight: "bold",
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
