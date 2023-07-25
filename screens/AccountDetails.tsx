import {
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import StyledInput from "../components/StyledInput";
import { RootStackScreenProps } from "../types";
import FullWidthButton from "../components/FullWidthButton";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { ref, set } from "firebase/database";
import { doc, setDoc } from "firebase/firestore";
import { capitalizeFirstLetter } from "../utils/utils";

export default function AccountDetailsScreen({
  navigation,
  route,
}: RootStackScreenProps<"AccountDetails">) {
  const theme = useColorScheme();
  const [email, setEmail] = useState("");

  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<any>({});

  const [pwd, setPwd] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);

  const [pwd2, setPwd2] = useState<string>("");
  const [matchPwd2, setMatchPwd2] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleEmail = (email: string) => {
    setEmail(email);
    console.log(email, " email");
    console.log(
      email.endsWith(route.params.university.domains[0]) && email.includes("@"),
      "ends with"
    );
    !email.endsWith(route.params.university.domains[0])
      ? setEmailError((prev: any) => ({ ...prev, universityError: true }))
      : setEmailError((prev: any) => ({ ...prev, universityError: false }));
    !email.includes("@")
      ? setEmailError((prev: any) => ({ ...prev, invalidFormat: true }))
      : setEmailError((prev: any) => ({ ...prev, invalidFormat: false }));

    setEmailValid(
      email.endsWith(route.params.university.domains[0]) && email.includes("@")
    );
  };



  const createAccount = async (data: any) => {
    const { firstName, lastName, university, userStatus, email } = data;
    try {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email, pwd)
      .then(async (res) => {
        
        setIsLoading(false);
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email: email,
          firstName: capitalizeFirstLetter(firstName),
          lastName: capitalizeFirstLetter(lastName),
          status: userStatus,
          university: university,
          verified: false,
          enrolledCourses: []
        });
        await sendEmailVerification(res.user)
        .then((res) => {
              navigation.navigate("EmailVerification");
            })
            .catch((err) => {
            });
        })
        .catch((error) => {
          setIsLoading(false);
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
        });

      setIsLoading(false);
    } catch (error: any) {
      console.log("error: ", error);
      setIsLoading(false);
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

  const handleSubmit = () => {
    if (!(emailValid && matchPwd && matchPwd2)) {
      return;
    }

    const data = {
      ...route.params,
      email: email,
      password: pwd,
    };

    createAccount(data);
  };

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
            <Text style={[styles.headerMainText]}>Account Details</Text>
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
            {emailError?.universityError && !emailError?.invalidFormat && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                Please enter your student email address ending with the
                university's domain
              </Text>
            )}
            {emailError?.invalidFormat && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                Please enter a valid email address
              </Text>
            )}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.bottom}
        >
          <FullWidthButton
            text={"Sign Up"}
            onPress={handleSubmit}
            disabled={!(emailValid && matchPwd && matchPwd2)}
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
