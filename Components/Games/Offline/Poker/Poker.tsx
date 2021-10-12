import { Center, HStack, SimpleGrid, VStack } from "@chakra-ui/layout";
import { name } from "faker";
import React, { ReactElement, useState, useEffect } from "react";
import { offlineResults, User } from "../../../../interfaces/app";
import { initCards } from "../../../../utils/games/general";
import Card from "../../../Helpers/Card";
import Player from "./Player";

interface Props {
  user: User;
}

export default function Poker({ user }: Props): ReactElement {
  //Handlers for games
  const dealCards = initCards();
  const [p1, setP1] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: true,
    reveal: true,
    out: false,
  });
  const [p2, setP2] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    reveal: false,
    out: false,
  });
  const [p3, setP3] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    reveal: false,
    out: false,
  });
  const [p4, setP4] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    reveal: false,
    out: false,
  });
  const cardArr = Array.from({ length: 5 }).map(() => {
    return { card: dealCards(1).join(), show: false };
  });
  const [table, setTable] = useState(cardArr);
  const [advance, setAdvance] = useState(false);

  //Recording
  const [runningTotal, setRunningTotal] = useState(0);
  const [runningResults, setRunningResults] = useState<offlineResults[]>([]);
  const [bank, setBank] = useState(user.balance);
  const [betAmount, setBetAmount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  return (
    <>
      <VStack>
        <HStack spacing="24px">
          <Player
            player={p2}
            setPlayer={setP2}
            ai={true}
            name={name.firstName()}
            advance={setAdvance}
          />
          <Player
            player={p3}
            setPlayer={setP3}
            ai={true}
            name={name.firstName()}
            advance={setAdvance}
          />
          <Player
            player={p4}
            setPlayer={setP4}
            ai={true}
            name={name.firstName()}
            advance={setAdvance}
          />
        </HStack>
        <HStack spacing="12px" my="8">
          {table.map((card) => {
            // @ts-ignore
            return <Card cardValue={card.show ? card.card : "red_back"} />;
          })}
        </HStack>
        <Player player={p1} setPlayer={setP1} ai={false} advance={setAdvance} />
      </VStack>
    </>
  );
}
