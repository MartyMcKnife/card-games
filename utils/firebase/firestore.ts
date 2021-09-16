import { Balance } from "./../../interfaces/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { User } from "../../interfaces/app";
import { db } from "./firebase-config";

export const getUser = async (userID: string): Promise<User | false> => {
  const docRef = doc(db, "users", userID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    return false;
  }
};

export const createUser = async (user: User) => {
  const collRef = collection(db, "users");
  await setDoc(doc(collRef, user.userID), user);
};

export const updateBalance = async (userID: string, newBalance: Balance) => {
  const docRef = doc(db, "users", userID);
  const docSnap = await updateDoc(docRef, { balance: newBalance });
};
