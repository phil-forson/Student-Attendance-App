import { View, Text, InvTouchableOpacity } from "../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IClassDetails, ICourseDetails } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StyleSheet, Platform, FlatList, Alert, Share } from "react-native";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import ClassCard from "../components/ClassCard";
import useUser from "../hooks/useUser";
import { CourseContext } from "../contexts/CourseContext";
import { ClassContext } from "../contexts/ClassContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const PASTCLASSES = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    className: "Lecture 1",
    duration: "3",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    className: "Lecture 2",
    duration: "3",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    className: "Lecture 3",
    duration: "1",
  },
];

export default function CourseDetails({ navigation, route }: any) {
  const course: ICourseDetails = route.params;
  const { setCourseData } = useContext(CourseContext);
  const { courseClass, setCourseClassData, courseClasses, setCourseClassesData } =
    useContext(ClassContext);
  const theme = useColorScheme();
  const nav = useNavigation<"Drawer">();

  const isFocused = useIsFocused();

  const { userDataPromise } = useUser();
  const [classTab, setClassTab] = useState("upcoming");
  const [canCreateClass, setCanCreateClass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSwitch = (value: string) => {
    setClassTab(value);
  };

  const shareCourseLink = () => {
    Share.share({
      message: course.courseLinkCode, // The course link you want to share
    })
      .then((result) => {})
      .catch((error) => {
        Alert.alert("Error sharing link:", error);
      });
  };

  const getUpcomingClass = async () => {
    const courseClassesData = route.params.courseClasses

    const now = new Date();
    console.log("course classes ", courseClassesData);
    console.log('course classes length ' , courseClasses?.length)
    if(courseClasses?.length > 0){
      console.log('there are course classes', courseClasses.length)
      const upcomingClasses = courseClasses.filter((classItem: any) => {
        return now < new Date(classItem.classStartTime?.toDate());
      });
  
      console.log("upcomingggg", upcomingClasses);
  
      if(upcomingClasses.length === 1){
        console.log('only one upcoming clasd')
        setCourseClassData(upcomingClasses[0])
      }
      else {

      upcomingClasses.sort((classA: any, classB: any) => {
        const dateA = classA.classStartTime?.getDate();
        const dateB = classB.classStartTime?.getDate();
        return dateA - dateB;
      });
  
      setCourseClassData(upcomingClasses[0]);}
    }
    else {
      setIsLoading(false)
    }
  };

  const getClassesData = async () => {

    const courseClassesData = route.params.courseClasses ;

    setCourseClassesData(courseClassesData)

    console.log('from classes fn ',)
    if(courseClassesData?.length > 0){

      const courseClassesPromises = courseClassesData?.map(
        async (classId: string) => {
          const classDoc = doc(db, "classes", classId);
          const classSnapshot = await getDoc(classDoc);
          return classSnapshot.data();
        }
      );
  
      Promise.all(courseClassesPromises)
        .then(async (courseClasses: any) => {
          setCourseClassesData(courseClasses);
          console.log('course classes enrolled ', courseClasses)
          getUpcomingClass()
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }

    
  };
  

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      userDataPromise
        .then(async (userData: any) => {
          await getClassesData();
          setCanCreateClass(userData?.uid === course?.creatorId);
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          Alert.alert("Something unexpected happeneddd");
        });
    }
    setCourseData(course);
  }, [route, isFocused]);

  useEffect(() => {
    console.log("can create class changed to ", canCreateClass);
  }, [canCreateClass]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#121212" : "#eee",
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <InvTouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            paddingVertical: 10,
          }}
        >
          <FontAwesome5
            name="bars"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </InvTouchableOpacity>
        <InvTouchableOpacity
          onPress={() => shareCourseLink()}
          style={{
            paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
            paddingVertical: 10,
          }}
        >
          <EvilIcons
            name="share-apple"
            size={30}
            color={theme === "dark" ? "white" : "black"}
          />
        </InvTouchableOpacity>
      </View>
      <ScrollView>
        <View
          lightColor="#fff"
          darkColor="#0c0c0c"
          style={[styles.header, styles.shadow]}
        >
          <View lightColor="#fff" darkColor="#0c0c0c">
            <Text style={[styles.bold]}>
              {course.courseTitle.length > 10
                ? course.courseTitle.slice(0, 10) + "..."
                : course.courseTitle}
            </Text>
          </View>
          <View lightColor="#fff" darkColor="#0c0c0c">
            <Text style={[styles.bold]}>{course.lecturerName}</Text>
          </View>
        </View>
        {/* <View style={[styles.center]}>
      </View> */}
        <View style={[styles.marginTop]}>
          <View
            style={[{ flexDirection: "row", justifyContent: "space-between" }]}
          >
            <Text style={[styles.bold]}>Upcoming Class</Text>
            <InvTouchableOpacity>
              <Text style={[{ color: "#2f95dc" }]}>View All</Text>
            </InvTouchableOpacity>
          </View>
          <InvTouchableOpacity
            style={[
              styles.card,
              styles.extraMarginTop,
              {
                justifyContent: "space-between",
                borderColor: theme === "light" ? "#737171" : "#fff",
                backgroundColor: theme === "light" ? "#fff" : "#121212",
              },
            ]}
          >
            <View style={[styles.transparentBg, {flexDirection: 'row', justifyContent: 'space-between'}]}>
              <Text style={[styles.bold]}>{courseClass.className}</Text>
              <Text style={[styles.smallText]}>In 2hrs</Text>
            </View>
            <View style={[styles.transparentBg]}>
              <Text style={[{ fontWeight: '400'}, styles.largeText]}>
                {courseClass?.classLocation?.name.split(',').slice(0,2).join(',')}
              </Text>
            </View>
            <View style={[styles.transparentBg]}>
              <Text style={[styles.smallText]}>Duration: 2hrs</Text>
            </View>
          </InvTouchableOpacity>
        </View>
        <View style={[{ marginTop: 50 }]}>
          <View
            style={[{ flexDirection: "row", justifyContent: "space-between" }]}
          >
            <Text style={[styles.bold]}>Past Classes</Text>
            <InvTouchableOpacity>
              <Text style={[{ color: "#2f95dc" }]}>View All</Text>
            </InvTouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.pastClassesContainer]}
            data={courseClasses ?? []}
            renderItem={({ item }) => (
              <ClassCard courseClass={item} navigation={navigation} />
            )}
            keyExtractor={(courseClass) => courseClass.classId}
            ItemSeparatorComponent={() => (
              <View style={[{ paddingRight: 30 }]}></View>
            )}
          />
        </View>
      </ScrollView>
      {canCreateClass && (
        <InvTouchableOpacity
          onPress={() => navigation.navigate("CreateClass")}
          style={[
            styles.bottom,
            styles.circle,
            styles.shadow,
            {
              shadowColor: theme === "dark" ? "#0a2e3d" : "#000",
              marginBottom: Platform.OS === "ios" ? 0 : 10,
            },
          ]}
          darkColor="#0c0c0c"
          lightColor="#fff"
        >
          <AntDesign
            name="plus"
            color={"#007bff"}
            size={18}
            style={{ fontWeight: "bold" }}
          />
        </InvTouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  marginTop: {
    marginTop: 8,
  },
  extraMarginTop: {
    marginTop: 15,
  },
  header: {
    marginVertical: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
  },
  bold: {
    fontWeight: "700",
    fontSize: 15,
  },
  shadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  circle: {
    borderRadius: 50,
    padding: 15,
  },
  card: {
    height: 150,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 0.8,
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  transparentBg: {
    backgroundColor: "transparent",
  },
  largeText: {
    fontSize: 20,
  },
  smallText: {
    fontSize: 12,
  },
  pastClassesContainer: {
    marginVertical: 10,
  },
});
