import {
  StyleSheet,
  useColorScheme,
  FlatList,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useState } from "react";
import {
  InvTouchableOpacity,
  Text,
  TouchableOpacity,
  View,
  
} from "../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import {
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import CardSeparator from "../components/CardSeparator";
import CourseCard from "../components/CourseCard";
import Constants from "expo-constants";
import Modal from "react-native-modal";
import JoinCourseModal from "../components/JoinCourseModal";

var width = Dimensions.get("window").width;
export const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    courseName: "DCIT 305 lorem this is a new course so if you select it it is new",
    lecturerName: "Big Man",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    courseName: "CSCD 112",
    lecturerName: "Old Neg",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    courseName: "Math 305",
    lecturerName: "Mr Sir",
  },
];

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const theme = useColorScheme();


  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isJoinCourseVisible, setIsJoinCourseVisible] =
    useState<boolean>(false);
  const [code, setCode] = useState("");

  const joinCourse = () => {
    setModalVisible(false);
    setTimeout(() => navigation.navigate('JoinCourse'), 800);
  };

  const createCourse = () => {
    setModalVisible(false)
    setTimeout(() => navigation.navigate("CreateCourse"), 800)
  }

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme === 'light' ? '#eee' : "#121212"
          }
        ]}
      
      >
        <View
          style={[
            {
              justifyContent: "space-between",
            },
          ]}
        >
          <InvTouchableOpacity
            onPress={() => navigation.openDrawer()}
            darkColor="#121212"
          >
            <FontAwesome5
              name="bars"
              color={theme === "dark" ? "white" : "black"}
              size={25}
            />
          </InvTouchableOpacity>
          <View></View>
        </View>
        <FlatList
          style={[styles.courseContainer]}
          data={DATA}
          renderItem={({ item }) => <CourseCard data={item} navigation={navigation} />}
          keyExtractor={(course) => course.id}
          ItemSeparatorComponent={() => <CardSeparator />}
        />

        <InvTouchableOpacity
          style={[
            styles.bottom,
            styles.circle,
            styles.shadow,
            {
              shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
            },
          ]}
          onPress={() => setModalVisible(true)}
          darkColor="#0c0c0c"
        >
          <AntDesign name="plus" color={"#007bff"} size={18} style={{fontWeight: 'bold'}} />
        </InvTouchableOpacity>
      </SafeAreaView>
      { isModalVisible && 
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
              paddingBottom: Platform.OS === 'ios' ? 60: 20,
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
            onPress={() => joinCourse()}
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
          <InvTouchableOpacity
            style={[
              {
                flexDirection: "row",
                height: 50,
                alignItems: "center",
              },
            ]}
            onPress={() => createCourse()}
          >
             <MaterialCommunityIcons name="plus" size={24} color={theme === "dark" ? "white" : "#424242"} />

            <Text
              style={{
                marginLeft: 15,
                fontSize: 15,
                fontWeight: "600",
                color: theme === "dark" ? "#fff" : "#424242",
              }}
            >
              Create Course
            </Text>
          </InvTouchableOpacity>
        </View>
      </Modal>
      }

    </>
  );
};
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
  signUp: {
    width: 10,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    marginBottom: 0,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  circle: {
    borderRadius: 50,
    padding: 15,
  },
  shadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  courseContainer: {
    marginVertical: 20,
  },
});
