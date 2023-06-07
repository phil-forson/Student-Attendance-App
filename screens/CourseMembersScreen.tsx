import { View, Text, InvTouchableOpacity } from "../components/Themed";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import { FontAwesome5 } from "@expo/vector-icons";
import UserListCard from "../components/UserListCard";
import { CourseContext } from "../contexts/CourseContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import CardSeparator from "../components/CardSeparator";
import { useIsFocused } from "@react-navigation/native";

export default function CourseMembersScreen({ navigation, route }: any) {
  const theme = useColorScheme();
  const { course, setEnrolledMembersData, enrolledMembers } = useContext(CourseContext);

  const [creatorData, setCreatorData] = useState<any>({});
  const [membersData, setMembersData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  const getData = async () => {
    setIsLoading(true);
    try {
      const userRef = query(
        collection(db, "users"),
        where("uid", "==", course.creatorId)
      );
      await getDocs(userRef).then(async (res) => {
        if (res.empty) {
          // No matching user found
          return null;
        }

        const user = res.docs[0].data();
        console.log("user ", user);
        setCreatorData(user);
        try {
          // const usersRef = query(
          //   collection(db, "users"),
          //   where("uid", "in", course.enrolledUsers)
          // );
    
          // const querySnapshot = await getDocs(usersRef);
    
          const enrolledUsersIds = course.enrolledStudents;
    
          const enrolledUsersPromises = enrolledUsersIds.map(async (userId: string) => {
            const usersRef = query(collection(db,'users'), where('uid', '==', userId));
            const querySnapshot = await getDocs(usersRef)
      
            if (querySnapshot.empty) {
              // Handle case where user is not found
              return null;
            }
      
            const userData = querySnapshot.docs[0].data();
            return userData;
          });
          console.log('enrolled ids ', enrolledUsersIds)
    
          console.log('promises ', enrolledUsersPromises)
    
          Promise.all(enrolledUsersPromises)
            .then((enrolledUsers: any) => {
    
              setMembersData(enrolledUsers);
              setEnrolledMembersData(enrolledUsers)
              console.log("enrolled users ", enrolledUsers);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              console.log(error);
              Alert.alert("Error obtaining enrolled courses");
            });
    
          // console.log("query snapshot ", querySnapshot);
    
          // const users = querySnapshot.docs.map((doc) => doc.data());
          // console.log("users ", users);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }).catch((error) => {
        console.log(error)
      });


      // Assuming there is only one user with the given creatorId
    } catch (error) {
      setIsLoading(false);
      console.log("Error getting user:", error);
      return null;
    }
  };

  

  useEffect(() => {
      console.log("course ", course);
      getData();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.center]}>
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
            paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
            paddingVertical: 10,
          }}
        >
          <FontAwesome5
            name="bars"
            color={theme === "dark" ? "white" : "black"}
            size={25}
          />
        </InvTouchableOpacity>
      </View>
      <View style={[{ paddingHorizontal: Platform.OS === "ios" ? 20 : 0 }]}>
        <Text
          style={[
            { fontSize: 22, borderBottomColor: "gray", borderBottomWidth: 1 },
          ]}
        >
          Teachers
        </Text>
        <UserListCard
          text={creatorData?.firstName + " " + creatorData?.lastName}
        />
      </View>
      <View
        style={[
          { paddingHorizontal: Platform.OS === "ios" ? 20 : 0, marginTop: 30 },
        ]}
      >
        <Text
          style={[
            { fontSize: 22, borderBottomColor: "gray", borderBottomWidth: 1, paddingVertical: 5 },
          ]}
        >
          Members ({enrolledMembers.length})
        </Text>
        {enrolledMembers.length > 0 ? (
          <FlatList
            style={styles.membersContainer}
            data={enrolledMembers}
            renderItem={({ item }) => (
              <UserListCard text={item?.firstName + " " + item?.lastName} />
            )}
            keyExtractor={(member: any) => member?.uid}
            ItemSeparatorComponent={() => <CardSeparator />}
          />
        ) : (
          <View style={styles.center}>
            <Text>No members</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  membersContainer: {
    marginVertical: 20,
  },
});
