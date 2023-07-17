import { View, Text, TouchableOpacity, InvTouchableOpacity } from "../components/Themed";
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
import * as FaceDetector from "expo-face-detector";
import { LinearGradient } from "expo-linear-gradient";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const FacialRecognitionScreen = ({
  navigation,
}: RootStackScreenProps<"FacialRecognition">) => {
  const [isFaceInFrame, setIsFaceInFrame] = useState<boolean>(true);
  const [frameArea, setFrameArea] = useState<any>({
    x: (width - 300) / 2,
    y: (height - 300) / 3.66,
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

  const handleFacesDetected = ({ faces }: any) => {
    console.log("faces detected");
  };

  function range(start: number, end: number, step: number) {
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  }

  const handleTouch = () => {
    if(!isFaceInFrame){
      setIsFaceInFrame(true);
    }
    else {
      console.log('is in frame')
    }
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
              onTouchStart={handleTouch}
            
            ></Camera>
            {!isFaceInFrame && (
              <View style={{ flex: 2 }}>
                <Text
                  style={{ fontSize: 20, textAlign: "center", marginTop: 10 }}
                >
                  Tap the camera area when your face is in the frame.
                </Text>
              </View>
            )}
          </>
        }
      />
      {isFaceInFrame && (
        <>
          {range(1, 200, 4).map((number, index) => (
            <LinearGradient
              key={index}
              colors={["white", "white"]} // Specify the colors for each edge
              start={{ x: 0, y: 0 }} // Start position of the gradient
              end={{ x: 1, y: 0 }} // End position of the gradient
              style={[
                styles.line,
                {
                  transform: [{ translateY: -1 }, { rotate: `${number}deg` }],
                },
              ]}
            />
          ))}
        </>
      )}
      <InvTouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={() => setIsFaceInFrame(false)} >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Tap camera area to register face.
        </Text>
        <Text>Tap here to go back</Text>
      </InvTouchableOpacity>

      {!isFaceInFrame && <View
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
      </View>}
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
  line: {
    position: "absolute",
    left: 16,
    top: "39%",
    width: "90%",
    height: 4,
    backgroundColor: "white",
    zIndex: 10,
  },
});
export default FacialRecognitionScreen as React.FC;
