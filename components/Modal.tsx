import { Platform } from "react-native";
import Modal from "react-native-modal";
import React from "react";
import useColorScheme from "../hooks/useColorScheme";
import { InvTouchableOpacity, View, Text } from "./Themed";
import { AntDesign } from '@expo/vector-icons'

export type ModalProps = {
  isModalVisible: boolean;
  setModalVisible: any
  modalContent: Array<any>
};

export default function ModalComponent({ isModalVisible,setModalVisible, modalContent }: ModalProps) {
    const theme = useColorScheme()
  return (
    <>
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
              paddingBottom: Platform.OS === "ios" ? 60 : 20,
            },
          ]}
        >
          <InvTouchableOpacity
            style={[
              {
                flexDirection: "row",
                height: 50,
                alignItems: "center",
              },
            ]}
        
          >
            <AntDesign
              name="addusergroup"
              size={20}
              color={theme === "dark" ? "white" : "#424242"}
            />
            <Text
              style={{
                marginLeft: 15,
                fontSize: 15,
                fontWeight: "600",
                color: theme === "dark" ? "#fff" : "#424242",
              }}
            >
              Join Course
            </Text>
          </InvTouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
