import { useState, useEffect } from "react";
import { User } from "../interfaces/app";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "@firebase/auth";
import { getUser } from "./firebase/firestore";
import { auth } from "./firebase/firebase-config";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userObj = await getUser(user.uid);
        if (userObj) {
          setUser(userObj);
          setLoading(false);
        } else {
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
    });
  }, [auth]);

  return { loading, user };
};
