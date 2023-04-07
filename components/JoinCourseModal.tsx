import Modal from "react-native-modal";
import { View, Text, InvTouchableOpacity } from "./Themed";
import React from "react";
import useColorScheme from "../hooks/useColorScheme";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { InputField } from "./InputField";

type Props = {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  courseCode: string;
  setCourseCode: React.Dispatch<React.SetStateAction<string>>;
};

export default function JoinCourseModal({
  isModalVisible,
  setModalVisible,
  courseCode,
  setCourseCode,
}: Props) {
  const theme = useColorScheme();
  return (
    <Modal
      isVisible={isModalVisible}
      hasBackdrop={true}
      backdropColor={theme === "dark" ? "#000" : "#121212"}
      backdropOpacity={0.5}
      onBackdropPress={() => setModalVisible(false)}
      style={[
        {
          padding: 0,
          margin: 0,
        },
      ]}
    >
      <View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: "hidden",
            height: "auto",
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 80,
          },
        ]}
      >
        {/* <InvTouchableOpacity
        style={[
          {
            flexDirection: "row",
            height: 50,
            borderBottomWidth: .7,
            borderBottomColor: theme === 'dark' ? '#232323': '#f4efef',
            alignItems: "center",
          },
        ]}
        onPress={() => {
          setModalVisible(false)

        }}
      >
        <MaterialIcons name="library-add" size={20} color={theme === 'dark'? 'white' : '#424242'} />
        <Text style={{
          marginLeft: 15,
          fontSize: 15,
          fontWeight: '600',
          color: theme === 'dark' ? '#fff':'#424242'
        }}>Join Course</Text>
      </InvTouchableOpacity>
      <InvTouchableOpacity
        style={[
          {
            flexDirection: "row",
            height: 50,
            borderBottomWidth: .7,
            borderBottomColor: theme === 'dark' ? '#232323': '#f4efef',
            alignItems: "center",
          },
        ]}
      >
        <Ionicons name="ios-create" size={20} color={theme === 'dark'? 'white' : '#424242'} />
        <Text style={{
          marginLeft: 15,
          fontSize: 15,
          fontWeight: '600',
          color: theme === 'dark' ? '#fff':'#424242'
        }}>Create Course</Text>
      </InvTouchableOpacity> */}
        <View>
          <Text>
            Enter the code for the course group you'd like to join. The code is
            available to the creator of the group.{" "}
          </Text>
          <InputField
            keyboardType="default"
            secure={false}
            placeholder="Class Code"
            placeholderTextColor="gray"
            valid={true}
            value={courseCode}
            setValue={setCourseCode}
          />
        </View>
      </View>
    </Modal>
  );
}
