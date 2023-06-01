import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "../components/Themed";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { RootStackScreenProps } from "../types";
import { StatusBar } from "expo-status-bar";
import { InputField } from "../components/InputField";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { APIKEY } from "@env";
import React from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import useAuth from "../hooks/useAuth";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignInScreen = ({
  navigation,
}: RootStackScreenProps<"SignIn">) => {
  const theme = useColorScheme();

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);
  
  const [pwd2, setPwd2] = useState<string>("");
  const [matchPwd2, setMatchPwd2] = useState<boolean>(false);
  
  const handleEmail = (email: string) => {
    setValidEmail(EMAIL_REGEX.test(email));
    setEmail(email);
  };

  const handlePwd = (pwd: string) => {
    setMatchPwd(PWD_REGEX.test(pwd));
    setPwd(pwd);
  };

  const handlePwd2 = (pwd2: string) => {
    setMatchPwd2(pwd2 === pwd);
    setPwd2(pwd2);
  };

  const handleSubmit = () => {
    if (validEmail && matchPwd && matchPwd2) {
      createAccount();
    } else {
      Alert.alert("Invalid", "Invalid Details!");
    }
  };

  const createAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pwd).then(
        async (response) => {
          const user = response.user
          const queryRef = query(
            collection(db, "users"),
            where("uid", "==", user?.uid)
          );

          const querySnapshot = await getDocs(queryRef);

          if (querySnapshot.size === 0) {
            // create a new user
            await addDoc(collection(db, "users"), {
              uid: user?.uid,
              enrolledCourses: [],
            });
          }
        }
      );
    } catch (e) {
      Alert.alert("There was a problem creating your account");
      console.log(e);
    }
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#fff" : "#121212",
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
          keyboardType="email-address"
          placeholderTextColor="#C7C7C7"
          value={pwd}
          setValue={handlePwd}
          valid={matchPwd}
          instructions="Password must have a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
          icon="lock1"
        />
      </View>
      <View style={styles.my}>
        <InputField
          placeholder="Confirm Password"
          secure={true}
          keyboardType="email-address"
          placeholderTextColor="#C7C7C7"
          value={pwd2}
          setValue={handlePwd2}
          valid={matchPwd2}
          instructions="Passwords do not match"
          icon="Safety"
        />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.bottom}>
        <TouchableOpacity
          style={[
            {
              width: "auto",
              marginVertical: 15,
              height: 40,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 200,
              backgroundColor: !(matchPwd && matchPwd2 && validEmail)
                ? "#878383"
                : theme === "light"
                ? "#000"
                : "#fff",
            },
          ]}
          disabled={!(validEmail && matchPwd && matchPwd2)}
          onPress={handleSubmit}
        >
          <Text
            lightColor="#fff"
            darkColor="#000"
            style={{
              fontWeight: "bold",
            }}
          >
            Sign Up
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
  signUp: {
    width: 10,
  },
  bottom: {
    marginBottom: 0,
    flex: 1,
    justifyContent: "flex-end",
  },
});
