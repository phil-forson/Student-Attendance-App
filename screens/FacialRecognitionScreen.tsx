import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  InvTouchableOpacity,
  SafeAreaView,
} from "../components/Themed";
import {
  StyleSheet,
  Animated,
  PermissionsAndroid,
  Touchable,
  Alert,
  Dimensions,
} from "react-native";
import { RNCamera } from "react-native-camera";
import {
  Camera,
  CameraType,
  requestCameraPermissionsAsync,
  requestMicrophonePermissionsAsync,
  getCameraPermissionsAsync,
  getMicrophonePermissionsAsync,
  FlashMode,
} from "expo-camera";
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";
import * as FaceDetector from "expo-face-detector";

const FacialRecognitionScreen = () => {
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const [type, setType] = useState(CameraType.front);
  const [flashMode, setFlashMode] = useState("off");
  const [pictureUri, setPictureUri] = useState("");
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isFaceInFrame, setIsFaceInFrame] = useState(false);
  const [faceBounds, setFaceBounds] = useState<any>(null);

  const [frameArea, setFrameArea] = useState<any>({
    x: (width - 300) / 4.5,
    y: (height - 300) / 4,
  });
  const cameraRef = useRef<any>();
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    await requestCameraPermissionsAsync();
    await requestMicrophonePermissionsAsync();
  };

  const getPermissions = async () => {
    const cameraPermission = await getCameraPermissionsAsync();
    const microphonePermission = await getMicrophonePermissionsAsync();

    return cameraPermission.granted && microphonePermission.granted;
  };

  const switchFlashMode = () =>
    setFlashMode(flashMode === "off" ? "on" : "off");

  const switchType = () =>
    setType(type === CameraType.back ? CameraType.front : CameraType.back);

  const takePicture = async () => {
    if (cameraRef) {
    }
    const { uri, width, height } = (await cameraRef?.current)
      ? cameraRef?.current.takePictureAsync()
      : null;
    setPictureUri(uri);
  };

  if (!getPermissions()) {
    return Alert.alert(
      "Permissions Required!",
      "You need to provide the permissions to access the camera",
      [{ text: "Got it" }]
    );
  }

  const handleFacesDetected = ({ faces }: any) => {
    console.log("yea faces ");
    if (faces.length > 0) {
      // Check if any face intersects with the frame area
      const frameArea = calculateFrameArea(); // Customize based on your frame dimensions
      const faceInFrame = faces.some((face: any) => {
        const faceBounds = face.bounds;
        setFaceBounds(faceBounds);
        console.log(faceBounds.origin.x, "x area");
        console.log(faceBounds.origin.y, "y area");
        console.log(faceBounds.size.width, "width");
        console.log(faceBounds.size.height, "height");
        return (
          faceBounds.origin.x < frameArea.x + frameArea.width &&
          frameArea.x < faceBounds.origin.x + faceBounds.size.width &&
          faceBounds.origin.y < frameArea.y + frameArea.height &&
          frameArea.y < faceBounds.origin.y + faceBounds.size.height
        );
      });

      setIsFaceInFrame(faceInFrame);
    } else {
      console.log("face not detected");
      setIsFaceInFrame(false);
    }
  };

  useEffect(() => {
    console.log("is face in frame ", isFaceInFrame);
  }, [isFaceInFrame]);

  const calculateFrameArea = () => {
    const frameSize = 300; // Customize the frame size as needed
    const frameX = (width - frameSize) / 4.5;
    const frameY = (height - frameSize) / 4;

    return {
      x: frameX,
      y: frameY,
      width: frameSize,
      height: frameSize,
    };
  };

  useEffect(() => {
    // calculateFrameArea()
  }, []);

  //   if(!permission?.granted){
  //     return (<View>
  //         <Text>We need to access your camera to continue</Text>
  //         <InvTouchableOpacity style={{padding: 20, backgroundColor: 'red'}} onPress={() => permission?.canAskAgain}><Text>Ask Again</Text></InvTouchableOpacity>
  //     </View>)
  //   }
  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: "white",
          }}
        />
      </View> */}

      <Animatable.View
        animation={isFaceInFrame ? "" : ""}
        iterationCount="infinite"
        style={{
          width: isFaceInFrame ? 320 : width,
          height: isFaceInFrame ? 320 : height,
          borderRadius: isFaceInFrame ? 700 : 0,
          borderWidth: isFaceInFrame ? 2 : 0,
          borderColor: "white",
          overflow: "hidden",
          marginTop: isFaceInFrame ? 110 : 0,
          marginLeft: isFaceInFrame ? 30 : 0,
          flex: isFaceInFrame ? 1 : 0,
          marginBottom: isFaceInFrame ? 20 : 0,
        }}
        children={
          <>
            <Camera
              style={styles.camera}
              type={type}
              ref={cameraRef}
              onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications:
                  FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 100,
                tracking: true,
              }}
            >
              {faceBounds && (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "transparent",
                    left: faceBounds?.origin?.x,
                    top: faceBounds.origin.y,
                    width: faceBounds.size.width,
                    height: faceBounds.size.height,
                    borderWidth: 2,
                    borderColor: "green",
                    borderRadius: 4,
                  }}
                />
              )}
            </Camera>
            {isFaceInFrame && (
        <>
          <View style={[styles.line, { transform: [{ rotate: "45deg" }] }]} />
          <View style={[styles.line, { transform: [{ rotate: "90deg" }] }]} />
          <View style={[styles.line, { transform: [{ rotate: "135deg" }] }]} />
          <View style={[styles.line, { transform: [{ rotate: "180deg" }] }]} />
          <View style={[styles.line, { transform: [{ rotate: "225deg" }] }]} />
          <View style={[styles.line, { transform: [{ rotate: "270deg" }] }]} />
          <View style={[styles.line, { transform: [{ rotate: "315deg" }] }]} />
        </>
      )}
            {!isFaceInFrame && (
              <View style={{ flex: 2 }}>
                <Text
                  style={{ fontSize: 20, textAlign: "center", marginTop: 10 }}
                >
                  Reposition your face inside the frame
                </Text>
              </View>
            )}
            {/* {isFaceInFrame && (
        <View style={{marginTop: 150}}>
          <Text>Move your head slowly </Text>
        </View>
      )} */}
          </>
        }
      />
     

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Please perform facial scan
        </Text>
      </View>
      {!isFaceInFrame && (
        <View
          style={[
            styles.overlay,
            {
              left: frameArea.x,
              top: frameArea.y,
              width: 350,
              height: 350,
            },
          ]}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 6,
  },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 3,
    borderRadius: 8,
    borderColor: "white",
  },
  indicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "green",
    opacity: 0.8,
  },
  instructionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  instructionsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  controlsContainer: {
    alignItems: "center",
    backgroundColor: "lightblue",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    left: 0,
    position: "absolute",
    right: 0,
  },
  takePictureButton: {
    backgroundColor: "#fff",
    borderRadius: 35,
    height: 70,
    marginVertical: 10,
    width: 70,
  },
  frameTop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "white",
  },
  frameLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 2,
    height: "100%",
    backgroundColor: "white",
  },
  frameRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 2,
    height: "100%",
    backgroundColor: "white",
  },
  frameBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "white",
  },
  line: {
    position: "absolute",
    top: 0,
    width: 200,
    height: 2,
    backgroundColor: "white",
    transform: [{ translateY: -1 }],
  },
});

export default FacialRecognitionScreen as React.FC;
