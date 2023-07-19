import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { InvTouchableOpacity, Text, View } from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";
import { styles } from "../styles/styles";
import Colors from "../constants/Colors";
import { Dimensions, Image, Pressable, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import FullWidthButton from "../components/FullWidthButton";

const SettingsScreen = ({ navigation }: any) => {
  const theme = useColorScheme();
  const width = Dimensions.get("screen").width;
  return (
    <View style={[{}, styles.container]}>
      <View
        style={[{ height: 200 }]}
        lightColor={Colors.light.primaryGrey}
        darkColor={Colors.dark.primaryGrey}
      ></View>
      <ScrollView
        style={[
          {
            flex: 3,
            paddingHorizontal: 20,
            marginTop: 110,
          },
          styles.my,
        ]}
      >
        <Text style={[styles.bold, styles.bigText, styles.textCenter, {}]}>
          John Doe
        </Text>
        <Text style={[styles.textCenter, styles.semiBold, styles.smy]}>
          Student
        </Text>
        <View
          style={[
            {
              height: 100,
              width: "100%",
              paddingVertical: 10,
              columnGap: 10,
            },
            styles.flexRow,
          ]}
        >
          <View
            lightColor={Colors.light.primaryGrey}
            darkColor={Colors.dark.primaryGrey}
            style={[
              {
                height: "100%",
                flex: 1,
                paddingHorizontal: 15,
                justifyContent: "space-evenly",
              },
              styles.flexColumn,
              styles.rounded,
            ]}
          >
            <Text
              style={[styles.light, { fontSize: 12 }]}
              darkColor={Colors.light.secondaryGrey}
              lightColor={Colors.dark.tetiary}
            >
              Total Attendance Time
            </Text>
            <Text
              style={[
                styles.bold,
                {
                  fontSize: 20,
                },
              ]}
            >
              4h55m
            </Text>
          </View>
          <View
            lightColor={Colors.light.primaryGrey}
            darkColor={Colors.dark.primaryGrey}
            style={[
              {
                height: "100%",
                flex: 1,
                paddingHorizontal: 15,
                justifyContent: "space-evenly",
              },
              styles.flexColumn,
              styles.rounded,
            ]}
          >
            <Text
              style={[styles.light, { fontSize: 12 }]}
              darkColor={Colors.light.secondaryGrey}
              lightColor={Colors.dark.tetiary}
            >
              Total Attendance Time
            </Text>
            <Text
              style={[
                styles.bold,
                {
                  fontSize: 20,
                },
              ]}
            >
              4h55m
            </Text>
          </View>
        </View>
        <View>
          <Text style={[styles.bigText, styles.bold, styles.my]}>Details</Text>
          <View
            lightColor={Colors.light.primaryGrey}
            darkColor={Colors.dark.primaryGrey}
            style={[
              styles.flexRow,
              styles.itemsCenter,
              styles.my,
              styles.rounded,
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
              },
            ]}
          >
            <View
              style={[
                {
                  paddingRight: 20,
                },
                styles.transBg,
              ]}
            >
              <AntDesign
                name="mail"
                size={20}
                color={
                  theme === "dark"
                    ? Colors.light.secondaryGrey
                    : Colors.dark.tetiary
                }
              />
            </View>
            <View style={[styles.transBg]}>
              <Text
                style={[
                  {
                    paddingVertical: 5,
                  },
                  styles.light,
                ]}
                darkColor={Colors.light.secondaryGrey}
                lightColor={Colors.dark.tetiary}
              >
                Student Email Address
              </Text>
              <Text
                style={[
                  {
                    paddingVertical: 5,
                    fontWeight: "500",
                  },
                ]}
              >
                johndoe@st.ug.edu.gh
              </Text>
            </View>
          </View>
          <View
            lightColor={Colors.light.primaryGrey}
            darkColor={Colors.dark.primaryGrey}
            style={[
              styles.flexRow,
              styles.itemsCenter,
              styles.my,
              styles.rounded,
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
              },
            ]}
          >
            <View
              style={[
                {
                  paddingRight: 20,
                },
                styles.transBg,
              ]}
            >
              <AntDesign
                name="mail"
                size={20}
                color={
                  theme === "dark"
                    ? Colors.light.secondaryGrey
                    : Colors.dark.tetiary
                }
              />
            </View>
            <View style={[styles.transBg]}>
              <Text
                style={[
                  {
                    paddingVertical: 5,
                  },
                  styles.light,
                ]}
                darkColor={Colors.light.secondaryGrey}
                lightColor={Colors.dark.tetiary}
              >
                University
              </Text>
              <Text
                style={[
                  {
                    paddingVertical: 5,
                    fontWeight: "500",
                  },
                ]}
              >
                University Of Ghana
              </Text>
            </View>
          </View>
        </View>

        <FullWidthButton text={"Sign Out"} />
      </ScrollView>
      <View
        style={[
          {
            position: "absolute",
            height: 200,
            width: 200,
            top: 100,
            left: width / 2 - 100,
            borderRadius: 10,
            padding: 10,
          },
        ]}
        lightColor={Colors.light.tetiary}
        darkColor={Colors.dark.secondaryGrey}
      >
        <View style={[{
          width: '100%',
          height: '100%'
        }]}>
          <Image
            source={require("../assets/profile.jpg")}
            style={[
              styles.fullImage,
              {
                zIndex: 10,
                
              },
            ]}
          />
        </View>
        <Pressable
          style={[
            styles.rounded,
            styles.circle,
            styles.itemsCenter,
            styles.justifyCenter,
            {
              width: 50,
              position: "absolute",
              right: -10,
              top: -20,
              zIndex: 1000,
              backgroundColor:
                theme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
          ]}
          onPress={() => console.log("editing...")}
        >
          <AntDesign name="edit" size={20} color={"green"} />
        </Pressable>
      </View>
    </View>
  );
};

export default SettingsScreen;
