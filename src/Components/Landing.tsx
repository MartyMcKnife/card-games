import React, { ReactElement, useState } from "react";
import Selector from "./Selector";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Auth/Login";
import { auth } from "../utils/firebase/firebase-config";
import { getUser } from "../utils/firebase/firestore";

export default function Landing(): ReactElement {
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState<string>();
  const [balance, setBalance] = useState<number>();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setAuthed(true);
      const userObj = await getUser(user.uid);
      if (userObj) {
        setName(userObj.userName);
        let total = 0;
        const balance = userObj.balance;
        for (const value in balance) {
          const chips: number = balance[value];
          total += parseInt(value) * chips;
        }
        setBalance(total);
      }
    } else {
      setAuthed(false);
    }
  });
  if (authed) {
    return <Selector name={name} balance={balance} />;
  } else {
    return <Login />;
  }
}
