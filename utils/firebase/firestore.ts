import { Balance } from "./../../interfaces/app";
import {
  addDoc,
  getDocs,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  increment,
} from "firebase/firestore";
import { User, ServerConf } from "../../interfaces/app";
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
  await updateDoc(docRef, { balance: newBalance });
};

export const createServer = async (server: ServerConf) => {
  const collRef = collection(db, "servers");
  await setDoc(doc(collRef, server.gameID), server);
};

export const randomServerID = async () => {
  const servers = await getDocs(collection(db, "servers"));

  if (!servers.empty) {
    const emptyServers = servers.docs.filter(
      (server) => server.data().currentPlayers < server.data().maxPlayers
    );
    const randServer = emptyServers[
      Math.floor(Math.random() * servers.size)
    ].data() as ServerConf;

    return randServer.gameID;
  } else {
    return false;
  }
};

export const getServerGameID = async (id: string): Promise<string> => {
  const servers = await getDocs(
    query(collection(db, "servers"), where("gameID", "==", id))
  );

  if (!servers.empty) {
    const serverData = servers.docs.filter(
      (server) => server.data().currentPlayers < server.data().maxPlayers
    );
    if (serverData.length > 0) {
      return serverData[0].data().gameID;
    }
  }
  return "";
};

export const connectPlayer = async (id: string) => {
  const serverRef = doc(db, "servers", id);

  await updateDoc(serverRef, { currentPlayers: increment(1) });
};
