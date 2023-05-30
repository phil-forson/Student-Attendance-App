import React,{ useEffect, useState } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { APIKEY } from "@env";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LogInScreen = ({ navigation }: RootStackScreenProps<"LogIn">) => {
  const theme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);

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
      logIn();
    } else {
      Alert.alert("Invalid", "Invalid Details!");
    }
  };

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
    } catch (error: any) {
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Your email or password was incorrect");
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert("An account with this email already exists");
      } else {
        Alert.alert("There was a problem with your request");
      }
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <InvTouchableOpacity onPress={() => navigation.goBack()} style={{paddingHorizontal: 5, paddingVertical: 5}}>
            <AntDesign name="left" size={20} color={theme==='dark' ? 'white': 'dark'}/>
          </InvTouchableOpacity>
        );
      },
    });
  }, []);
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#eee" : "#121212",
        },
      ]}
    >
      <View
        style={{
          marginTop: 100,
        }}
      >
        <Text
          style={[
            styles.bold,
            {
              fontSize: 20,
              // color: "#008be3",
            },
          ]}
        >
          Enter Your Details
        </Text>
      </View>
      <View style={styles.my}>
        <InputField
          placeholder="Email Address"
          secure={false}
          keyboardType="email-address"
          placeholderTextColor="#C7C7C7"
          value={email}
          setValue={handleEmail}
          valid={validEmail}
          instructions="Email should be a valid email"
          icon="mail"
        />
      </View>
      <View style={styles.my}>
        <InputField
          placeholder="Password"
          secure={true}
          keyboardType="default"
          placeholderTextColor="#C7C7C7"
          value={pwd}
          setValue={handlePwd}
          valid={matchPwd}
          instructions="Password must have a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
          icon="lock1"
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.bottom}
      >
        <TouchableOpacity
          lightColor="#eee"
          darkColor="#121212"
          style={{
            height: 40,
            justifyContent: "center",
            marginVertical: 15,
          }}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              width: "auto",
              marginVertical: 15,
              paddingHorizontal: 10,
              height: 40,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: !(matchPwd && validEmail)
                ? "#147ec0"
                : "#008be3",
            },
          ]}
          disabled={!(matchPwd && validEmail)}
          onPress={handleSubmit}
        >
          <Text
            lightColor="#fff"
            darkColor="#000"
            style={{
              fontWeight: "bold",
            }}
          >
            Log In
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  my: {
    marginVertical: 10,
  },
  bottom: {
    marginBottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
