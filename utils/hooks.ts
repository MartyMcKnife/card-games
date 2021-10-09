import { useState, useEffect } from "react";
import { User } from "../interfaces/app";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "@firebase/auth";
import { getUser } from "./firebase/firestore";
import { auth } from "./firebase/firebase-config";
import { text as loadingText } from "./loadingtext";
import router from "next/router";

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

  return { loading, user, setLoading };
};

export const useLoadingText = () => {
  const [text, setText] = useState<string>();

  useEffect(() => {
    const updateText = () => {
      const randomIndex = Math.round(Math.random() * loadingText.length);
      setText(loadingText[randomIndex]);
    };
    updateText();
    const interval = setInterval(updateText, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return text;
};

export const useManualCheck = () => {
  const [manual, setManual] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setManual((router.query["manual"] as string) === "true");
      setLoading(false);
    }
  }, [router.query]);
  return { manual, loading };
};
