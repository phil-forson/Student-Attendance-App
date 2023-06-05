import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserData } from "../types";

export default function useUser() {
  const { authPromise } = useAuth();
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async () => {
    setIsLoading(true);

    await authPromise
      .then(async (response) => {
        try {
          const queryRef = query(
            collection(db, "users"),
            where("uid", "==", response?.uid)
          );

          const querySnapshot = await getDocs(queryRef);

          const userData = querySnapshot.docs[0].data();
          setUserData(userData.firstName);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.log("error resolving promise", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const userDataPromise = new Promise(async (resolve, reject) => {
    await authPromise
      .then(async (response) => {
        try {
          const queryRef = query(
            collection(db, "users"),
            where("uid", "==", response?.uid)
          );

          const querySnapshot = await getDocs(queryRef);

          const userData = querySnapshot.docs[0].data();
          resolve(userData)
        } catch (error) {
          reject(new Error("User does not exist"))
          console.log("use user error ", error)
        } 
      })
      .catch((error: any) => {
        console.log("error resolving promise");
        reject(new Error("User not found"))

      });
  })

  return {
    userData,
    isLoading,
    userDataPromise
  };
}
