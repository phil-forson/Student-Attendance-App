import { View, Text, TouchableOpacity } from "../components/Themed";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  FlatList,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import StyledInput from "../components/StyledInput";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import axios from "axios";
import { RootStackScreenProps } from "../types";
import FullWidthButton from "../components/FullWidthButton";
import Colors from "../constants/Colors";

export default function UniversityDetails({
  navigation,
  route,
}: RootStackScreenProps<"UniversityDetails">) {
  const [universitySearch, setUniversitySearch] = useState<string>("");
  const [areUniversitiesLoading, setAreUniversitiesLoading] =
    useState<boolean>(false);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [universities, setUniversities] = useState<Array<any>>([]);
  const [university, setUniversity] = useState<any>();

  const theme = useColorScheme();

  const handleUniversityChange = async (uni: string) => {
    setIsItemSelected(false);
    setAreUniversitiesLoading(true);
    setUniversitySearch(uni);

    const apiUrl = `http://universities.hipolabs.com/search?name=${uni}&country=Ghana`;

    try {
      console.log("trying");
      await axios
        .get(apiUrl)
        .then((response) => {
          const data = response.data;
          console.log("data ", data);
          setUniversities(data);
          setAreUniversitiesLoading(false);
        })
        .catch((e) => {
          console.log("places error ", e);
          setAreUniversitiesLoading(false);
        });
    } catch (error) {
      setAreUniversitiesLoading(false);
      // Handle error
      console.error(error);
    }
  };

  const handleContinue = () => {
    if (!isItemSelected) {
      return;
    }
    const data = {
      ...route.params,
      university: university,
    };

    console.log(data);

    navigation.navigate("UserStatus", data);
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000" : "#fff" },
      ]}
    >
      <View
        style={[
          styles.subContainer,
          { paddingVertical: Platform.OS === "ios" ? 40 : 60 },
        ]}
      >
        <View style={[]}>
          <View style={[]}>
            <Text style={[styles.headerMainText]}>University Details</Text>
            <View></View>
          </View>
          <Text style={[styles.headerSubText]}>
            Great! Now, let's gather some information about your university.
            Please enter the name of your university.
          </Text>
          {/* <Image source={require("../assets/personalInfo.png")} style={[styles.image]}/> */}
          <View style={[styles.my]}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              Please select your university
            </Text>
            <View style={[styles.inputContainer]}>
              <StyledInput
                placeholder="Search University"
                placeholderTextColor="gray"
                secure={false}
                keyboardType="default"
                valid={isItemSelected}
                value={universitySearch}
                setValue={handleUniversityChange}
              />
              {!(areUniversitiesLoading || isItemSelected) && (
                <View style={{ maxHeight: 330 }}>
                  <FlatList
                    data={universities}
                    renderItem={({ item }: any) => (
                      <TouchableOpacity
                        onPress={() => {
                          setUniversity(item);
                          setUniversitySearch(item.name);
                          setIsItemSelected(true);
                        }}
                        darkColor={Colors.dark.secondaryGrey}
                        lightColor={Colors.light.secondaryGrey}
                        style={[
                          {
                            padding: 10,
                            height: 55,
                            justifyContent: "center",
                          },
                        ]}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item: any, index) => index.toString()}
                  />
                </View>
              )}
              {areUniversitiesLoading && (
                <View
                  style={[
                    {
                      height: 80,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    },
                  ]}
                >
                  <ActivityIndicator />
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={[styles.bottom]}>
          <FullWidthButton
            text={"Continue"}
            onPress={handleContinue}
            disabled={!isItemSelected}
            style={{ borderRadius: 50, paddingHorizontal: 10 }}
          />
        </View>
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
    justifyContent: "space-between",
  },
  headerMainText: {
    fontSize: 30,
    fontWeight: "700",
  },
  headerSubText: {
    marginTop: 10,
    fontSize: 16,
  },
  my: {
    marginVertical: 30,
  },
  inputContainer: {
    marginTop: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 0,
  },
});
