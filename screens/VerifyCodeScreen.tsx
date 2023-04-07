import { useState}  from 'react'
import { StatusBar } from "expo-status-bar"
import { KeyboardAvoidingView, Platform, StyleSheet, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { InputField } from "../components/InputField"
import { Text, TextInput, TouchableOpacity, View } from "../components/Themed"
import { AntDesign, MaterialIcons  } from '@expo/vector-icons'
import { RootStackScreenProps } from '../types'


const VerifyCodeScreen = ({navigation} : RootStackScreenProps<'VerifyCode'>) => {
    const theme = useColorScheme()
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [textChanged, setTextChanged] = useState<boolean>(false);
    const [code, setCode ] = useState<string>('')
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
            marginTop: 60,
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
            Enter the verification code sent to your email account.
          </Text>
        </View>
        <View style={{
            marginTop: 20
        }}>
            <Text style={{
                color:"#7b7676"
            }}>An email has been sent to the account you provided. Provide the code sent in that account</Text>
        </View>
        <View style={styles.my}>
        <View style={styles.iconContainer}>
          <View style={[styles.icon, styles.front]}>
            <MaterialIcons name='verified-user' color={theme === 'light'? 'black': 'white'} size={20}/>
          </View>
        </View>
        <TextInput
        style={{
          height: 40,
          paddingLeft: 30,
          paddingRight: 50,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 4,
          borderColor: isFocused
            ? textChanged ?
                "#0083eb"
                : "#C7C7C7"
            : '#0083EB'

        }}
        placeholder="Enter Your Code"
        placeholderTextColor='#C7C7C7'
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);        }}
        value={code}
        onChangeText={(text: string) => {
            setCode(text);
            setTextChanged(true);
          }}
 
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
                backgroundColor: code === '' ? '#878383': theme === 'light' ? '#000' : '#fff'
              },
            ]}
            disabled={code === ''}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text lightColor="#fff" darkColor="#000" style={{
              fontWeight: 'bold'
            }}>
              Change Password
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
    iconContainer: {
        position: "relative",
        zIndex: 1,
      },
      icon: {
        zIndex: 9999,
        position: "absolute",
      },
      front: {
        top: 10,
      },
  });

  export default VerifyCodeScreen