import { View, Text, InvTouchableOpacity } from "../components/Themed";
import { SafeAreaView, StyleSheet, Platform, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import { FontAwesome5 } from "@expo/vector-icons";
import UserListCard from "../components/UserListCard";
import { CourseContext } from "../contexts/CourseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import CardSeparator from "../components/CardSeparator";
import { useIsFocused } from "@react-navigation/native";

export default function CourseMembersScreen({ navigation, route }: any) {
  const theme = useColorScheme();
  const { course } = useContext(CourseContext);

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
      const querySnapshot = await getDocs(userRef);

      if (querySnapshot.empty) {
        // No matching user found
        return null;
      }

      // Assuming there is only one user with the given creatorId
      const user = querySnapshot.docs[0].data();
      console.log("user ", user);
      setCreatorData(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error getting user:", error);
      return null;
    }
  };

  const getMembers = async () => {
    console.log('getting members...')
    setIsLoading(true);
    try {
      const usersRef = query(
        collection(db, "users"),
        where("uid", "in", course.enrolledUsers)
      );

      const querySnapshot = await getDocs(usersRef);

      console.log("query snapshot ", querySnapshot);

      const users = querySnapshot.docs.map((doc) => doc.data());
      console.log("users ", users);
      setMembersData(users);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getData();
      getMembers();
    }
  }, [isFocused]);

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
          Lecturer Name
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
            { fontSize: 22, borderBottomColor: "gray", borderBottomWidth: 1 },
          ]}
        >
          Members
        </Text>
        {membersData.length > 0 ? (
          <FlatList
            style={styles.membersContainer}
            data={membersData}
            renderItem={({ item }) => (
              <UserListCard text={item?.firstName + " " + item?.lastName} />
            )}
            keyExtractor={(member: any) => member.uid}
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
