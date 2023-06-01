import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FullWidthButton from "../components/FullWidthButton";
import Button from "../components/FullWidthButton";
import { Text, TouchableOpacity, View } from "../components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";
import { auth } from "../config/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import { ANDROIDCLIENTID, IOSCLIENTID, EXPOCLIENTID, SCHEME } from '@env'

WebBrowser.maybeCompleteAuthSession();

const LandingScreen = ({ navigation }: RootStackScreenProps<"Root">) => {
  const theme = useColorScheme();

  const [token, setToken] = useState<any>("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROIDCLIENTID,
    iosClientId: IOSCLIENTID,
    expoClientId: EXPOCLIENTID,
    redirectUri: makeRedirectUri({
      scheme: SCHEME,
    }),
  });

  useEffect(() => {
    console.log(response);
    try {
      if (response?.type === "success") {
        setToken(response?.authentication?.accessToken);
        getGoogleUser(response?.authentication?.accessToken);
        console.log("success");
      } else if (response?.type === "error") {
        console.log("failure");
      }
    } catch (e) {
      console.log("error creating google account ", e);
    }
  }, [response, token]);

  const getGoogleUser = async (accessToken: any) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response);

      const user = response.json();
      console.log(user);
    } catch (error) {
      console.log("GoogleUserReq error: ", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#eee" : "#121212",
        },
      ]}
    >
      <View>
        <Image
          source={require("../assets/teacher.png")}
          style={{ height: 250, width: "auto", resizeMode: "cover" }}
        />
      </View>
      <View
        style={{
          marginTop: 40,
        }}
      >
        <Text
          style={[styles.center, styles.bold, { fontSize: 25, marginTop: 5 }]}
        >
          Welcome back, Sir
        </Text>
        <Text
          style={[styles.center, { paddingVertical: 10 }]}
          darkColor="#c4c4c4"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
          reprehenderit nesciunt voluptate quis quo labore debitis maiores
          inventore aspernatur officiis!
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              flexDirection: "row",
              paddingHorizontal: 20,
              justifyContent: "center",
              backgroundColor: '#ed3f3f'
            },
          ]}

          onPress={() => navigation.navigate("SignIn")}
        >
          <Text
            lightColor="#fff"
            darkColor="#c4c4c4"
            style={[styles.semiBold, { marginRight: 10 }]}
          >
            Sign Up
          </Text>
          <AntDesign name="arrowright" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.orContainer}>
          <View
            style={[
              styles.line,
              {
                backgroundColor: theme === "light" ? "#c7c7c7" : "#fff",
              },
            ]}
          />
          <Text style={styles.text}>or</Text>
          <View
            style={[
              styles.line,
              {
                backgroundColor: theme === "light" ? "#c7c7c7" : "#fff",
              },
            ]}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              borderColor: theme === "dark" ? "#fff" : "#eee",
              borderWidth: 1.4,
              flexDirection: "row",
              justifyContent: "center",
              paddingHorizontal: 20,
            },
          ]}
          lightColor="#fff"
          darkColor="#121212"
          onPress={() => promptAsync({ useProxy: false })}
        >
          <Image
            source={require("../assets/google-icon.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text
            lightColor="#000"
            darkColor="#c4c4c4"
            style={[styles.semiBold, { marginLeft: 10 }]}
          >
            Continue With Google
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.center}>By signing up you accept the </Text>
        <Text style={[styles.center, { fontWeight: "bold" }]}>
          Terms Of Service <Text style={styles.normal}>and </Text>Privacy Policy
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: Platform.OS === "ios" ? 50 : 20,
        }}
      >
        <Text lightColor="#1a1616" darkColor="#eee">
          Already have an account?
        </Text>
        <TouchableOpacity
          lightColor="#eee"
          darkColor="#121212"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate("LogIn")}
        >
          <Text lightColor="#ed3f3f" darkColor="#ed3f3f">
            Log in
          </Text>
        </TouchableOpacity>
      </View>
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
  semiBold: {
    fontWeight: "800",
  },
  btn: {
    width: "auto",
    marginVertical: 10,
    height: 55,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    textAlign: "center",
  },
  normal: {
    fontWeight: "normal",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
  },
});

export default LandingScreen;
