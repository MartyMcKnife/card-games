import React, { ReactElement, useState, useEffect, useRef } from "react";
import {
  connectPlayer,
  disconnectPlayer,
  nextPlayer,
  startGame,
  updateStart,
} from "../../../../utils/firebase/firestore";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { onSnapshot, DocumentData, doc } from "@firebase/firestore";
import { Realtime, RPlayers, User } from "../../../../interfaces/app";
import { db } from "../../../../utils/firebase/firebase-config";

import { useAuth } from "../../../../utils/hooks";
import FullPageLoading from "../../../Helpers/FullPageLoading";
import useAsyncEffect from "use-async-effect";
import Seat from "../Seat";
import { calc } from "@chakra-ui/styled-system";
// import { calcBal } from "../../Landing";

interface Props {
  code: string;
  user: User;
}

export default function Blackjack({ code, user }: Props): ReactElement {
  const [curUID, setCurUID] = useState<string>();
  const [timeLeft, setTimeLeft] = useState<number>();
  const [usStart, setUsStart] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [players, setPlayers] = useState<RPlayers[]>();
  const [min2, setMin2] = useState(false);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      setDimensions({
        width: canvasRef.current.offsetWidth,
        height: canvasRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "realtime", code), async (item) => {
      const data = item.data() as Realtime;

      //Add us to the db if we aren't there
      if (
        data.players.findIndex((player) => player.userID === user.userID) < 0
      ) {
        await connectPlayer(code, user.userName, user);
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
        setCurUID(data.currentPlayer);
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
      if (players && curUID) {
        if (
          timeLeft === Math.round(Date.now() / 1000) &&
          user.userID === curUID
        ) {
          await nextPlayer(code, players, curUID);
          clearInterval(interval);
        }
      }
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, curUID]);

  //Seats will be placed around in a semicircle to the timer and current player
  //This can be given by (rcos(k*pi/n), rsin(k*pi/n))
  //Where r is radius, k is the element number, and n is one more than the elements to place

  if (players) {
    const seats = players.map((player, i) => {
      const x = Math.cos((i * Math.PI) / (players.length + 1));
      const y = Math.sin((i * Math.PI) / (players.length + 1));
      console.log(dimensions);
      return (
        <Box position="absolute" left={x} top={y}>
          <Seat
            name={player.username}
            bal={500} //calcBal(player.bal)}
            active={curUID === player.userID ? true : false}
          />
        </Box>
      );
    });
    return (
      <div ref={canvasRef}>
        <h1>Code: {code}</h1>
        <Box position="relative" w="full" h="full">
          {seats}
        </Box>
      </div>
    );
  } else {
    return null;
  }
}
