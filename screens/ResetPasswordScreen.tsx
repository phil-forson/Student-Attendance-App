import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "../components/Themed";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, useColorScheme } from "react-native";
import { RootStackScreenProps } from "../types";
import { StatusBar } from "expo-status-bar";
import { InputField } from "../components/InputField";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import React from "react";


const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ResetPasswordScreen = ({
  navigation,
}: RootStackScreenProps<"ResetPassword">) => {
  const theme = useColorScheme();



  const [pwd, setPwd] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);

  const [pwd2, setPwd2] = useState<string>("");
  const [matchPwd2, setMatchPwd2] = useState<boolean>(false);

  const handlePwd = (pwd: string) => {
    setMatchPwd(PWD_REGEX.test(pwd));
    setPwd(pwd);
  };

  const handlePwd2 = (pwd2: string) => {
    setMatchPwd2(pwd2 === pwd);
    setPwd2(pwd2);
  };

  const handleSubmit = () => {
    if (matchPwd && matchPwd2) {
        createAccount()
    } else {
      Alert.alert("Invalid", "Invalid Details!");
    }
  };

  const createAccount = async () => {
    try {

    }
    catch(e){
        Alert.alert('There was a problem creating your account')
    }
  }

  useEffect(() => {
  }, [])

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
          marginTop: 80,
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
            Enter new passwords
        </Text>
      </View>
      <View style={styles.my}>
        <InputField
          placeholder="Enter Password"
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
                backgroundColor: !(matchPwd && matchPwd2) ? '#878383': theme === 'light' ? '#000' : '#fff'
              },
            ]}
            disabled={!(matchPwd && matchPwd2)}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text lightColor="#fff" darkColor="#000" style={{
              fontWeight: 'bold'
            }}>
              Reset Password
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
    width: 10
  },
  bottom: {
    marginBottom: 0,
    flex: 1,
    justifyContent: 'flex-end'
  }
});
