import { StyleSheet, SafeAreaView, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import StyledInput from "../components/StyledInput";
import { RootStackScreenProps } from "../types";
import FullWidthButton from "../components/FullWidthButton";

export default function AccountDetailsScreen({
  navigation,
  route,
}: RootStackScreenProps<"AccountDetails">) {
  const theme = useColorScheme();
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);

  const [pwd2, setPwd2] = useState<string>("");
  const [matchPwd2, setMatchPwd2] = useState<boolean>(false);

  const handlePwd = (pwd: string) => {
    setMatchPwd(pwd.length > 7);
    setPwd(pwd);
  };

  const handlePwd2 = (pwd2: string) => {
    setMatchPwd2(pwd2 === pwd);
    setPwd2(pwd2);
  };

  const domains = route.params.university.domains; // Get the array of domains from route.params
  const preparedDomain = domains.map((domain: any) =>
    domain.replace(".", "\\.")
  );

  const emailRegexPattern = `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+(${preparedDomain.join(
    "|"
  )})$`;
  const emailRegex = new RegExp(emailRegexPattern);
  const work = route.params.university.domains;


  const handleEmail = (email: string) => {
    setEmail(email);
    setEmailValid(emailRegex.test(email));
  };

  const handleSubmit = () => {
    if(!(emailValid && matchPwd && matchPwd2)){
      return ;
    }

    const data = {
      ...route.params,
      email: email,
      password: pwd
    }

    console.log('data ', data)
  }

  useEffect(() => {
    console.log("email valid changed to ", emailValid);
  }, [emailValid]);
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000" : "#fff" },
      ]}
    >
      <View style={[styles.subContainer]}>
        <View style={[styles.headerView]}>
          <View style={[]}>
            {/* <View style={[styles.iconContainer]}></View> */}
            <Text style={[styles.headerMainText]}>Email Address</Text>
          </View>
          <Text style={[styles.headerSubText]}>
            Please enter your{" "}
            {route.params.userStatus === "Student" ? "student" : "staff"} email
            address. We'll use this for communication and account verification
          </Text>
          <View style={[styles.my]}>
            <Text style={[styles.label]}>Email Address</Text>
            <StyledInput
              value={email}
              setValue={handleEmail}
              secure={false}
              keyboardType="email-address"
              placeholder="Email Address"
              placeholderTextColor="gray"
              valid={emailValid}
            />
          </View>
          <View style={[styles.my]}>
            <Text style={[styles.label]}>Password</Text>
            <StyledInput
              value={pwd}
              setValue={handlePwd}
              secure={true}
              keyboardType="default"
              placeholder="Password"
              placeholderTextColor="gray"
              valid={matchPwd}
            />
          </View>
          <View style={[styles.my]}>
            <Text style={[styles.label]}>Confirm Password</Text>
            <StyledInput
              value={pwd2}
              setValue={handlePwd2}
              secure={true}
              keyboardType="default"
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              valid={matchPwd2}
            />
          </View>
        </View>
        <View style={[styles.bottom]}>
          <FullWidthButton
            text={"Sign Up"}
            onPress={handleSubmit}
            disabled={!(emailValid && matchPwd && matchPwd2)}
            style={{ paddingHorizontal: 10 }}
          />
        </View>
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
  },
  headerSubText: {
    marginTop: 10,
    fontSize: 20,
  },
  my: {
    marginVertical: 20,
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
