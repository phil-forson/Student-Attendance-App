import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { useEffect } from "react";
import { ColorSchemeName } from "react-native/types";
import useAuth from "../hooks/useAuth";
import LinkingConfiguration from "./LinkingConfiguration";
import RootNavigator from "./rootStack";
import UserStack from "./userStack";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
    const { user } = useAuth()

    useEffect(() => {
        console.log('this is the user')
        console.log(user)
    }, [])
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {user ? <UserStack /> : <RootNavigator />}
    </NavigationContainer>
  );
}

