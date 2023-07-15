import { View, Text } from "../components/Themed";
import React, { useEffect, useRef, useState } from "react";
import * as Animatable from "react-native-animatable";
import {
  Camera,
  requestCameraPermissionsAsync,
  getCameraPermissionsAsync,
  CameraType,
} from "expo-camera";
import { Alert, Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { RootStackScreenProps } from "../types";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const FacialRecognitionScreen = ({
  navigation,
}: RootStackScreenProps<"FacialRecognition">) => {
  const [isFaceInFrame, setIsFaceInFrame] = useState<boolean>(false);
  const [frameArea, setFrameArea] = useState<any>({
    x: (width - 300) / 2,
    y: (height - 300) / 4,
    h: 300,
    w: 300,
  });

  const cameraRef = useRef<any>();
  const requestPermissions = async () => {
    await requestCameraPermissionsAsync();
  };

  const getPermissions = async () => {
    const cameraPermission = await getCameraPermissionsAsync();

    return cameraPermission.granted;
  };

  const handleFacesDetected = ({faces}: any) => {
    console.log('faces detected')
  }
  useEffect(() => {
    requestPermissions();
  }, []);

  if (!getPermissions()) {
    return Alert.alert(
      "Permissions Required!",
      "You need to provide the permissions to access the camera",
      [{ text: "Got it" }]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View
        style={{
          width: isFaceInFrame ? 300 : width,
          height: isFaceInFrame ? 400 : height,
          borderRadius: isFaceInFrame ? 1000 : 0,
          borderWidth: isFaceInFrame ? 2 : 0,
          borderColor: "white",
          overflow: "hidden",
          marginTop: isFaceInFrame ? 100 : 0,
          marginLeft: isFaceInFrame ? 40 : 0,
          flex: isFaceInFrame ? 1 : 0,
          marginBottom: isFaceInFrame ? 60 : 0,
          zIndex: 1000,
        }}
        children={
          <>
            <Camera
              type={CameraType.front}
              style={styles.camera}
              ref={cameraRef}
              onFacesDetected={handleFacesDetected}
            ></Camera>
            {!isFaceInFrame && (
              <View style={{ flex: 2 }}>
                <Text
                  style={{ fontSize: 20, textAlign: "center", marginTop: 10 }}
                >
                  Reposition your face inside the frame
                </Text>
              </View>
            )}
          </>
        }
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Please perform facial scan
        </Text>
      </View>

      <View
        style={[
          styles.overlay,
          {
            left: frameArea.x,
            top: frameArea.y,
            width: frameArea.w,
            height: frameArea.h,
            zIndex: 100000,
          },
        ]}
      >
        <View
          style={[
            styles.crossLine,
            {
              top: -10,
              left: 150,
            },
          ]}
        />
        <View
          style={[
            styles.horizontalLine,
            {
              top: 150,
              left: -10,
            },
          ]}
        />
        <View
          style={[
            styles.crossLine,
            {
              bottom: -10,
              left: 150,
            },
          ]}
        />
        <View
          style={[
            styles.horizontalLine,
            {
              top: 150,
              right: -10,
            },
          ]}
        />
      </View>
      <Text>FacialRecognitionScreen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 6,
  },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
  },
  crossLine: {
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
    height: 20,
    zIndex: 10000,
  },
  horizontalLine: {
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
    height: 1,
    width: 20,
    zIndex: 10000,
  },
});
export default FacialRecognitionScreen as React.FC;
