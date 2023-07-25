import React, { useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import { Alert } from "react-native";
import { UserData } from "../types";

export const UserProvider = ({ children }: any) => {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [previouslyLoggedIn, setPreviouslyLoggedIn] = useState<boolean>(false);
  const [isUserDataLoading, setUserDataLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>();

  return (
    <UserContext.Provider
      value={{
        userLoggedIn,
        setUserLoggedIn,
        previouslyLoggedIn,
        setPreviouslyLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
