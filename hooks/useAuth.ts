import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";

export default function useAuth() {
  const [user, setUser] = useState<User | undefined>();
  const [isUserLoading, setIsUserLoading] = useState(false);
  const { userLoggedIn, setUserLoggedIn } = useContext(UserContext);

  useEffect(() => {
    let isMounted = true;
    setIsUserLoading(true);

    const unsubscribeFromAuthStateChanged = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          if (user) {
            if (isMounted) {
              setUser(user);
              setIsUserLoading(false);
              if (user.emailVerified) {
                setUserLoggedIn(true);
              }
            }
          } else {
            if (isMounted) {
              setUser(undefined);
              setIsUserLoading(false);
            }
          }
        } catch (error) {
          console.log("Error updating user state:", error);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribeFromAuthStateChanged();
    };
  }, []);

  const authPromise = new Promise<User>((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          resolve(user);
          setIsUserLoading(false);
        } else {
          setUser(undefined);
          setIsUserLoading(false);
        }
      } catch (error) {
        console.log("Error updating user state:", error);
        reject(new Error("User not found"));
      }
    });
  });

  return {
    user: user,
    authPromise: authPromise,
  };
}
