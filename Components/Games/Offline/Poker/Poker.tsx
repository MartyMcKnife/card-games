import { Center, HStack, SimpleGrid, VStack } from "@chakra-ui/layout";
import { name } from "faker";
import React, { ReactElement, useState, useEffect } from "react";
import { FaceNums, offlineResults, User } from "../../../../interfaces/app";
import { initCards, processHand } from "../../../../utils/games/general";
import Card from "../../../Helpers/Card";
import Player from "./Player";
import * as ps from "pokersolver";
import { updateBalance } from "../../../../utils/firebase/firestore";
const Hand = ps.Hand;

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
    turns: 0,
    reveal: true,
    out: false,
  });
  const [p2, setP2] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    turns: 0,
    reveal: false,
    out: false,
  });
  const [p3, setP3] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    turns: 0,
    reveal: false,
    out: false,
  });
  const [p4, setP4] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    turns: 0,
    reveal: false,
    out: false,
  });
  //make us able to search an array of players
  const players = [p1, p2, p3, p4];
  const setPlayers = [setP1, setP2, setP3, setP4];
  //Generate our cards
  const cardArr = Array.from({ length: 5 }, function () {
    return { card: dealCards(1).join() as FaceNums, show: false };
  });
  const [table, setTable] = useState(cardArr);
  const [advance, setAdvance] = useState(false);
  const [maxBet, setMaxBet] = useState(0);
  const [restart, setRestart] = useState(false);
  const [end, setEnd] = useState(false);

  //Recording
  const [runningTotal, setRunningTotal] = useState(0);
  const [runningResults, setRunningResults] = useState<offlineResults[]>([]);
  const [bank, setBank] = useState(user.balance);
  const [showResult, setShowResult] = useState(false);

  //Advance to next player
  useEffect(() => {
    if (advance) {
      const curI = players.findIndex((player) => player.turn === true);
      //Get index of next player

      let nextI = curI === players.length - 1 ? 0 : curI + 1;

      //Increment the index if it the next player has folded

      while (players[nextI].out === true) {
        nextI++;
        if (nextI === players.length - 1) {
          nextI = 0;
        }
      }
      //Set our next player!
      setPlayers[nextI]({ ...players[nextI], turn: true });
      //Remove our current player!
      setPlayers[curI]({
        ...players[curI],
        turn: false,
        turns: players[curI].turns + 1,
      });
      setAdvance(false);
    }
  }, [advance]);
  //Reveal the cards
  useEffect(() => {
    const inPlayers = players.filter((player) => player.out === false);
    //Get the turn we are on - calculated from turns numbers, and getting the smallest
    const turnNo = Math.min(...inPlayers.map((player) => player.turns));

    switch (turnNo) {
      //Reveal first 3
      case 1:
        const three = table.map((card, i) => {
          if (i < 3) {
            return { card: card.card, show: true };
          } else {
            return { card: card.card, show: false };
          }
        });
        setTable(three);
      //Reveal first 4
      case 2:
        const four = table.map((card, i) => {
          if (i < 3) {
            return { card: card.card, show: true };
          } else {
            return { card: card.card, show: false };
          }
        });
        setTable(four);
      //Reveal all
      case 3:
        const all = table.map((card, i) => {
          if (i < 3) {
            return { card: card.card, show: true };
          } else {
            return { card: card.card, show: false };
          }
        });
        setTable(all);
      case 4:
        //Game End. Reveal all
        setPlayers.forEach((setPlayer, i) => {
          setPlayer({ ...players[i], reveal: true });
        });
        setEnd(true);
      //Default
      default:
        return;
    }
  }, [players]);
  //Player handlers
  useEffect(() => {
    setMaxBet(Math.max(...players.map((player) => player.bet)));
  }, [players]);
  //Game end
  useEffect(() => {
    if (end) {
      const tCards = table.map((t) => t.card);
      const results = players.map((player, i) => {
        let result = Hand.solve(processHand([...player.cards, ...tCards]));
        if (i === 0) {
          result.type = "P";
        } else {
          result.type = "AI";
        }
      });
      const winnerObj = Hand.winner(results);

      let pool = players.reduce((a, b) => a + b["bet"], 0);
      let earnings = pool;
      let winner = "P";

      if (winnerObj.type === "AI") {
        earnings = -players[0].bet;
        winner = "AI";
      }
      setRunningTotal(runningTotal + earnings);
      setBank(bank + earnings);
      setRunningResults([
        ...runningResults,
        {
          gain: earnings,
          winningHands: [
            {
              earnings: earnings,
              hand: winnerObj.name,
              winner,
            },
          ],
        },
      ]);
      updateBalance(user.userID, bank + earnings);
      setShowResult(true);
    }
  }, [end]);
  //Restart
  useEffect(() => {
    if (restart) {
      setRestart(false);
      setPlayers.map((setPlayer, i) => {
        const player = i === 0 ? true : false;
        setPlayer({
          cards: dealCards(2),
          bet: 0,
          turn: player,
          turns: 0,
          reveal: player,
          out: false,
        });
      });
      const cardArr = Array.from({ length: 5 }).map(() => {
        return { card: dealCards(1).join() as FaceNums, show: false };
      });
      setTable(cardArr);
      setMaxBet(0);
    }
  }, [restart]);

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
            tableCards={table}
            maxBet={maxBet}
          />
          <Player
            player={p3}
            setPlayer={setP3}
            ai={true}
            name={name.firstName()}
            advance={setAdvance}
            tableCards={table}
            maxBet={maxBet}
          />
          <Player
            player={p4}
            setPlayer={setP4}
            ai={true}
            name={name.firstName()}
            advance={setAdvance}
            tableCards={table}
            maxBet={maxBet}
          />
        </HStack>
        <HStack spacing="12px" my="8">
          {table.map((card, i) => {
            return (
              <Card cardValue={card.show ? card.card : "red_back"} key={i} />
            );
          })}
        </HStack>
        <Player
          player={p1}
          setPlayer={setP1}
          ai={false}
          advance={setAdvance}
          tableCards={table}
          maxBet={maxBet}
        />
      </VStack>
    </>
  );
}
