import React, { ReactElement, useState, useEffect } from "react";
import {
  connectPlayer,
  disconnectPlayer,
  nextPlayer,
  startGame,
  updateStart,
} from "../../../utils/firebase/firestore";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { onSnapshot, DocumentData, doc } from "@firebase/firestore";
import { Realtime, RPlayers, User } from "../../../interfaces/app";
import { db } from "../../../utils/firebase/firebase-config";

import { useAuth } from "../../../utils/hooks";
import FullPageLoading from "../../Helpers/FullPageLoading";
import useAsyncEffect from "use-async-effect";

interface Props {
  code: string;
  user: User;
}

export default function Blackjack({ code, user }: Props): ReactElement {
  const [currentUser, setCurrentUser] = useState<string>();
  const [timeLeft, setTimeLeft] = useState<number>();
  const [usStart, setUsStart] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [players, setPlayers] = useState<RPlayers[]>();
  const [min2, setMin2] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "realtime", code), async (item) => {
      const data = item.data() as Realtime;

      //Add us to the db if we aren't there
      if (
        data.players.findIndex((player) => player.userID === user.userID) < 0
      ) {
        await connectPlayer(code, user.userName, user.userID);
      }

      //Check there is enough players to play
      if (data.players.length > 1) {
        setMin2(true);
      }

      //Check if we should start
      const startNo = data.players.filter((player) => player.start).length;
      if (startNo > data.players.length / 2) {
        setGameStart(true);
        // First player triggers game start
        if (user.userID === data.players[0].userID) {
          await startGame(code, data.players);
        }
      }

      // Handle the updating of the current player
      if (data.currentPlayer !== "NOTSTARTED") {
        setTimeLeft(data.timeLeft);
        const username = data.players.find(
          (player) => player.userID === data.currentPlayer
        ).username;
        setCurrentUser(username);
      }
      setPlayers(data.players);
    });
    return () => {
      unsub();
      disconnectPlayer(code, user.userID);
    };
  }, []);

  useAsyncEffect(async () => {
    if (usStart) {
      await updateStart(code, user.userID);
    }
  }, [usStart]);

  useAsyncEffect(async () => {
    const interval = setInterval(async () => {
      if (players && currentUser) {
        const userID = players.find(
          (player) => player.username === currentUser
        ).userID;

        if (
          timeLeft === Math.round(Date.now() / 1000) &&
          user.userID === userID
        ) {
          await nextPlayer(code, players, currentUser);
          clearInterval(interval);
        }
      }
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, currentUser]);
  return <></>;
}
