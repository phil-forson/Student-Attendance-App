import {
  StyleSheet,
  useColorScheme,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "../components/Themed";
import useAuth from "../hooks/useAuth";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { auth } from "../config/firebase";
import CardSeparator from "../components/CardSeparator";
import CourseCard from "../components/CourseCard";
import Constants from 'expo-constants'
import { HEYA } from '@env'

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const theme = useColorScheme();

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      courseName: 'DCIT 305',
      ownerName: 'Big Man'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      courseName: 'CSCD 112',
      ownerName: 'Old Neg'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      courseName: 'Math 305',
      ownerName: 'Mr Sir'
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#fff" : "#121212",
        },
      ]}
    >
      <View
        style={[
          {
            justifyContent: "space-between",
          },
        ]}
      >
        <TouchableOpacity
          darkColor="#121212"
          lightColor="#fff"
          onPress={() => navigation.openDrawer()}
        >
          <FontAwesome5
            name="bars"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
 
        </TouchableOpacity>
        <View></View>
      </View>
      {/* <View style={[styles.center]}>
        <Text style={{ textAlign: "center" }}>
          You have not joined any courses. Tap on the button below to create or join a
          course
        </Text>
      </View> */}
      <FlatList 
      style={[styles.courseContainer]}
      data={DATA}
      renderItem={({item}) => <CourseCard data={item} />}
      keyExtractor={course => course.id}
      ItemSeparatorComponent={() => <CardSeparator />}
      />

      <TouchableOpacity style={[styles.bottom, styles.circle, styles.shadow, {
        shadowColor: theme === 'dark' ? '#0a2e3d' : '#000'
      }]} lightColor="#fff" darkColor="#fff">
        <AntDesign
          name="plus"
          color={'#007bff'}
          size={18}
        />
      </TouchableOpacity>
    </SafeAreaView>
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
    padding: 15
  },
  shadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  courseContainer: {
    marginVertical: 20
  }
});
