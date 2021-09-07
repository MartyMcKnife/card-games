import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/dist/client/router";
import Landing from "../Components/Landing";
import { onAuthStateChanged } from "@firebase/auth";
import { getUser } from "../utils/firebase/firestore";
import { auth } from "../utils/firebase/firebase-config";
import { User } from "../interfaces/app";
export default function Index(): ReactElement {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userObj = await getUser(user.uid);
      if (userObj) {
        setUser(userObj);
      } else {
        router.push("/signin");
      }
    } else {
      router.push("/signin");
    }
  });
  return <>{user && <Landing user={user} />}</>;
}
