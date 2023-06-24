import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import React,{ useContext, useEffect } from "react";
import { ColorSchemeName } from "react-native/types";
import useAuth from "../hooks/useAuth";
import LinkingConfiguration from "./LinkingConfiguration";
import RootNavigator from "./rootStack";
import UserStack from "./userStack";
import { UserContext } from "../contexts/UserContext";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {

    const { user } = useAuth();
    const { userLoggedIn } = useContext(UserContext)

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {userLoggedIn ? <UserStack /> : <RootNavigator />}
    </NavigationContainer>
  );
}

