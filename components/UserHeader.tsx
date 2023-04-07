import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "./Themed";
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { Platform, useColorScheme } from "react-native";
import { UserStackParamList, UserStackScreenProps } from "../types";

const UserHeader = ( navigation: any ) => {
    const theme = useColorScheme()
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: Platform.OS== 'ios' ? 15 : 1 ,
        backgroundColor: theme === 'dark' ? '#000' : '#fff',
        borderBottomColor: '#eee',
        borderBottomWidth: 0.7
      }}
    >
      <TouchableOpacity
        style={{
          height: 30,
          justifyContent: "center",
          flex: 1,
        }}
        lightColor="#fff"
        darkColor="#000"
        onPress={() => navigation.openDrawer()}
      >
        <FontAwesome name="bars" size={20} color={theme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          height: 30,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlignVertical: "top",
          }}
        >
          Milker
        </Text>
      </View>
      <View style={{ flex: 1 }}></View>
    </SafeAreaView>
  );
};

export default UserHeader