import React, { useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import useAuth from "../hooks/useAuth";

export const UserProvider = ({ children }: any) => {
  const { user } = useAuth();
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [isUserLoading, setUserLoading] = useState(false);

  useEffect(() => {
    console.log("user ", user);
    if (user) {
        setUserLoggedIn(true);
        setUserLoading(false);
    } else {
      setUserLoggedIn(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
