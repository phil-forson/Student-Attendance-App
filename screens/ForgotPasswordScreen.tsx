import { StatusBar } from "expo-status-bar"
import { useState } from 'react'
import { Platform, useColorScheme } from "react-native"
import { KeyboardAvoidingView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { InputField } from "../components/InputField"
import { Text, TouchableOpacity, View } from "../components/Themed"
import { AntDesign } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types"
import React from 'react'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const ForgotPasswordScreen = ({ navigation }: RootStackScreenProps<'ForgotPassword'>) => {
    const theme = useColorScheme()
    const [email, setEmail] = useState<string>("");
    const [validEmail, setValidEmail] = useState<boolean>(false);


    const handleEmail = (email: string) => {
        setValidEmail(EMAIL_REGEX.test(email));
        setEmail(email);
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
            Enter the email address associated with your account.
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
        <KeyboardAvoidingView behavior="padding" style={styles.bottom}>
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
                backgroundColor: !(validEmail) ? '#878383': theme === 'light' ? '#000' : '#fff'
              },
            ]}
            disabled={!validEmail}
            onPress={() => navigation.navigate('VerifyCode')}
          >
            <Text lightColor="#fff" darkColor="#000" style={{
              fontWeight: 'bold'
            }}>
              Send Code
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
    )
}

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
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
  });

export default ForgotPasswordScreen