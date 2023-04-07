import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "./Themed";
import { AntDesign } from '@expo/vector-icons'

type Props = {
  name: string;
  cancel?: boolean;
};

const Header = ({ name, cancel = true }: Props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 10,
      }}
    >
      {cancel ? (
        <View style={{
            height: 30,
            justifyContent: "center",
            flex: 1
        }}>
        {/* <TouchableOpacity
          lightColor="#fff"
          darkColor="#000"
        >
          <Text
            style={{
              fontSize: 15,
              textAlignVertical: "center",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity> */}
        <AntDesign name="left" size={20}/>
        </View>
      ) : (
        <View
          style={{
            height: 30,
          }}
        ></View>
      )}
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
          {name}
        </Text>
      </View>
      <View style={{flex: 1}}></View>
    </SafeAreaView>
  );
};

export default Header;
