import { Balance, Realtime, RPlayers } from "./../../interfaces/app";
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

export const updateBalance = async (userID: string, newBalance: number) => {
  const docRef = doc(db, "users", userID);
  await updateDoc(docRef, { balance: newBalance });
};

export const createServer = async (server: ServerConf, user: User) => {
  const collRef = collection(db, "servers");
  const realRef = collection(db, "realtime");
  await setDoc(doc(collRef, server.gameID), server);
  await setDoc(doc(realRef, server.gameID), {
    gameID: server.gameID,
    currentPlayer: "NOTSTARTED",
    timeLeft: 9999,
    players: [
      {
        username: user.userName,
        userID: user.userID,
        bal: user.balance,
        start: false,
      },
    ],
  });
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

export const connectPlayer = async (
  id: string,
  username: string,
  user: User
) => {
  const serverRef = doc(db, "servers", id);
  const realtimeRef = doc(db, "realtime", id);
  const curPlayers = ((await getDoc(realtimeRef)).data() as Realtime).players;
  await updateDoc(serverRef, { currentPlayers: increment(1) });
  await updateDoc(realtimeRef, {
    players: [
      ...curPlayers,
      {
        username: username,
        userID: user.userID,
        start: false,
        bal: user.balance,
      },
    ],
  });
};

export const disconnectPlayer = async (id: string, userID: string) => {
  const serverRef = doc(db, "servers", id);
  const realtimeRef = doc(db, "realtime", id);

  await updateDoc(serverRef, { currentPlayers: increment(-1) });
  //Get existing data for game
  const currentReal = (await getDoc(realtimeRef)).data() as Realtime;

  let currentPlayer = currentReal.currentPlayer;
  //Handler to see if our disconnected player is currently on his turn - if he is, jump to the next player
  if (userID === currentReal.currentPlayer && currentReal.players.length > 0) {
    const currentI = currentReal.players.findIndex(
      (player) => player.userID === userID
    );
    currentPlayer =
      currentReal.players[
        //If we are at the end of the array, jump to the first position
        //Otherwise go to the next
        currentI === currentReal.players.length - 1 ? 0 : currentI + 1
      ].userID;
  }
  await updateDoc(realtimeRef, {
    currentPlayer,
    //Delete our player
    players: currentReal.players.filter((player) => player.userID !== userID),
  });
};

export const startGame = async (id: string, players: RPlayers[]) => {
  const realtimeRef = doc(db, "realtime", id);
  await updateDoc(realtimeRef, {
    currentPlayer: players[Math.floor(Math.random() * players.length)].userID,
    timeLeft: Math.round(Date.now() / 1000 + 30),
  });
};

export const nextPlayer = async (
  id: string,
  players: RPlayers[],
  currentPlayer: string
) => {
  const realtimeRef = doc(db, "realtime", id);
  const cInex = players.findIndex((player) => player.userID === currentPlayer);
  await updateDoc(realtimeRef, {
    currentPlayer: players[cInex === players.length - 1 ? 0 : cInex + 1].userID,
    timeLeft: Math.round(Date.now() / 1000 + 30),
  });
};

export const updateStart = async (id: string, userID: string) => {
  const realtimeRef = doc(db, "realtime", id);
  const data = (await getDoc(realtimeRef)).data() as Realtime;
  const updatedPlays = data.players.map((player) => {
    if (player.userID === userID) {
      return {
        ...player,
        start: true,
      };
    } else {
      return player;
    }
  });
  await updateDoc(realtimeRef, { players: updatedPlays });
};
