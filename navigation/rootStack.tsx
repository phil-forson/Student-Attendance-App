import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Header from "../components/Header";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LandingScreen from "../screens/LandingScreen";
import { LogInScreen } from "../screens/LogInScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
import { SignInScreen } from "../screens/SignInScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import { RootStackParamList, RootStackScreenProps } from "../types";
import FacialRecognitionScreen from "../screens/FacialRecognitionScreen";
import Onboarding from "../screens/Onboarding";
import PersonalInfo from "../screens/PersonalInfo";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen
        name="Root"
        component={Onboarding}
        options={({ navigation }: RootStackScreenProps<"Root">) => ({
          header: () => null,
          headerTransparent: true,
        })}
      />
      <Stack.Screen
      name="PersonalInfo"
      component={PersonalInfo}
      options={({ navigation }: RootStackScreenProps<"PersonalInfo">) => ({
        header: () => null
      })}
       />
      <Stack.Screen
        name="SignUp"
        component={SignInScreen}
        options={({ navigation }: RootStackScreenProps<"SignUp">) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="LogIn"
        component={LogInScreen}
        options={({ navigation }: RootStackScreenProps<"LogIn">) => ({
          headerLeft: () => null,
          headerTransparent: true,
          animation: "flip",
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={({ navigation }: RootStackScreenProps<"ForgotPassword">) => ({
          headerLeft: () => null,
          headerTransparent: true,
          animation: "flip",
        })}
      />
      <Stack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={({ navigation }: RootStackScreenProps<"VerifyCode">) => ({
          headerLeft: () => null,
          headerTransparent: true,
          animation: "flip",
        })}
      />
       <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={({ navigation }: RootStackScreenProps<"ResetPassword">) => ({
          headerLeft: () => null,
          headerTransparent: true,
          animation: "flip",
        })}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen 
      name="FacialRecognition"
      component={FacialRecognitionScreen}
      options={({navigation}: RootStackScreenProps<"FacialRecognition">) => ({
        header: () => null
      })}
      />
    </Stack.Navigator>
  );
}
