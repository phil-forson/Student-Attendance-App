import {  StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "../components/Themed";
import useAuth from "../hooks/useAuth";
import { AntDesign } from '@expo/vector-icons'
import { auth } from "../config/firebase";

export const ProfileScreen = () => {
  const { user } = useAuth();
  const theme = useColorScheme()

  const signOut = () => {
    auth.signOut()
  }
  return (
    <SafeAreaView
    style={[
      styles.container,
      {
        backgroundColor: theme === "light" ? "#fff" : "#000",
      },
    ]}
    >
      <View style={[{
        justifyContent: 'space-between'
      }]}>
        <View>
          <Text>Welcome {user?.email}</Text>
          <View></View>
        </View>
      </View>
      <Text>Welcome {user?.email}</Text>
      <View>
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
              },
            ]}
            onPress={signOut}
          >
            <Text lightColor="#fff" darkColor="#000" style={{
              fontWeight: 'bold'
            }}>
              Sign Out
            </Text>
            <AntDesign
              name="arrowright"
              size={20}
              color={theme === "light" ? "white" : "black"}
              style={{ marginLeft: 10 }}
            />
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