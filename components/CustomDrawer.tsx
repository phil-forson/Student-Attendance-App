import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "./Themed";
import { Alert, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { auth } from "../config/firebase";
import { useTheme } from "@react-navigation/native";
import useColorScheme from "../hooks/useColorScheme";

const CustomDrawer = (props: any) => {
  const { user } = useAuth();
  const [signOut, setSignout] = useState(false);

  const handleSignOut = () => {
    auth.signOut();
  };

  const theme = useColorScheme();
  return (
    <View
      lightColor="transparent"
      darkColor="#121212"
      style={{
        flex: 1,
      }}
    >
      <DrawerContentScrollView
        {...props}
        style={[styles.view, styles.marginVertical, {}]}
      >
        <View
          darkColor="#24252e"
          style={[
            {
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 10,
            },
          ]}
        >
          <View
            darkColor="#24252e"
            style={{
              flexDirection: "row",
              marginBottom: 10,
              alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <View darkColor="#24252e">
              <Image
                source={require("../assets/profileimg.png")}
                style={{
                  height: 55,
                  width: 55,
                }}
              />
            </View>
          </View>
          <View darkColor="#24252e">
            <Text
              lightColor=""
              darkColor="#fff"
              style={{
                fontWeight: "400",
                fontSize: 13,
              }}
            >
              @{user?.email}
            </Text>
          </View>
        </View>
        <View
          darkColor="#24252e"
          style={[
            styles.marginTop,
            {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingVertical: 10,
            },
          ]}
        >
          <DrawerItemList {...props} />
        </View>
        <View
          darkColor="#24252e"
          style={[
            {
              paddingBottom: 20,
              paddingHorizontal: 20,
              justifyContent: 'center',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10
            },
          ]}
        >
          <TouchableOpacity
            lightColor="#fff"
            darkColor="#24252e"
            style={{
              flexDirection: "row",
            }}
            onPress={() =>
              Alert.alert("Sign Out", "Do you want to continue to sign out?", [
                {
                  text: "Yes",
                  onPress: handleSignOut,
                },
                {
                  text: "No",
                  onPress: () => setSignout(false),
                },
              ])
            }
          >
            <AntDesign name="logout" size={20} color="red" />
            <Text style={{ marginLeft: 30, color: "red", fontSize: 15 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 10,
    marginHorizontal: 5,
  },
  marginTop: {
    marginTop: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  marginVertical: {},
});

export default CustomDrawer;
