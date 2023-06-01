import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserData } from "../types";

export default function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        const userId = user.uid;

        try {
          const queryRef = query(
            collection(db, "users"),
            where("uid", "==", user?.uid)
          );

          const querySnapshot = await getDocs(queryRef);

          if (querySnapshot.size > 0) {
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
          }
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };

    getUserData();
  }, []);
  return {
    userData,
    isLoading,
  };
}
