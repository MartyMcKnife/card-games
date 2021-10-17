import { Center, Flex, HStack, SimpleGrid, VStack } from "@chakra-ui/layout";
import { name } from "faker";
import React, { ReactElement, useState, useEffect } from "react";
import { FaceNums, offlineResults, User } from "../../../../interfaces/app";
import { initCards, processHand } from "../../../../utils/games/general";
import Card from "../../../Helpers/Card";
import Player from "./Player";
import * as ps from "pokersolver";
import { updateBalance } from "../../../../utils/firebase/firestore";
import ManualStats from "../ManualStats";
import { printReport } from "../../../../utils/report";
import { Button } from "@chakra-ui/button";
const Hand = ps.Hand;

interface Props {
  user: User;
}

export default function Poker({ user }: Props): ReactElement {
  //Handlers for games
  const dealCards = initCards();
  //#region - Player setups
  const [p1, setP1] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: true,
    turns: 0,
    reveal: true,
    out: false,
    name: "Player",
  });
  const [p2, setP2] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    turns: 0,
    reveal: false,
    out: false,
    name: name.firstName(),
  });
  const [p3, setP3] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    turns: 0,
    reveal: false,
    out: false,
    name: name.firstName(),
  });
  const [p4, setP4] = useState({
    cards: dealCards(2),
    bet: 0,
    turn: false,
    turns: 0,
    reveal: false,
    out: false,
    name: name.firstName(),
  });
  //make us able to search an array of players
  const players = [p1, p2, p3, p4];
  const setPlayers = [setP1, setP2, setP3, setP4];
  //#endregion

  //Generate our cards
  const [table, setTable] = useState(
    Array.from({ length: 5 }, function () {
      return { card: dealCards(1).join("") as FaceNums, show: false };
    })
  );
  const [advance, setAdvance] = useState(false);
  const [getTurn, setGetTurn] = useState(false);
  const [maxBet, setMaxBet] = useState(0);
  const [restart, setRestart] = useState(false);
  const [end, setEnd] = useState(false);

  //#region - Recording
  const [runningTotal, setRunningTotal] = useState(0);
  const [runningResults, setRunningResults] = useState<offlineResults[]>([]);
  const [bank, setBank] = useState(user.balance);
  const [showResult, setShowResult] = useState(false);
  //#endregion

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
        console.log(nextI, players[nextI]);
      }
      console.log(nextI, curI, players[curI], players[nextI]);
      //Set our next player!
      setPlayers[nextI]({ ...players[nextI], turn: true });
      //Remove our current player!
      setPlayers[curI]({
        ...players[curI],
        turn: false,
        turns: players[curI].turns + 1,
      });
      setAdvance(false);
      setGetTurn(true);
    }
  }, [advance]);
  //Reveal the cards
  useEffect(() => {
    if (getTurn) {
      setGetTurn(false);
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
          break;
        //Reveal first 4
        case 2:
          const four = table.map((card, i) => {
            if (i < 4) {
              return { card: card.card, show: true };
            } else {
              return { card: card.card, show: false };
            }
          });
          setTable(four);
          break;
        //Reveal all
        case 3:
          const all = table.map((card, i) => {
            return { card: card.card, show: true };
          });
          setTable(all);
          break;
        case 4:
          //Game End. Reveal all player's cards
          setPlayers.forEach((setPlayer, i) => {
            setPlayer({ ...players[i], reveal: true });
          });
          setEnd(true);
          break;
        //Default
        default:
          return;
      }
    }
  }, [players]);
  //Get max bet, and reveal if out
  useEffect(() => {
    setMaxBet(Math.max(...players.map((player) => player.bet)));
    players.forEach((player, i) => {
      if (player.out) {
        setPlayers[i]({ ...player, reveal: true });
      }
    });
  }, [players]);
  //Game end
  useEffect(() => {
    if (end) {
      const tCards = table.map((t) => t.card);
      //Calculate a solved results hand
      const results = players
        .map((player, i) => {
          let result = Hand.solve(processHand([...player.cards, ...tCards]));
          //So we know whether the winner is the player, or AI
          if (i === 0) {
            result.type = "P";
          } else {
            result.type = "D";
          }
          // Only return if they are still in the game
          if (!player.out) {
            return result;
          } else {
            //Return out, which is then removed
            return "OUT";
          }
        })
        .filter((result) => result !== "OUT");
      //Find the winner
      const winnerObj = Hand.winners(results);
      console.log(winnerObj);
      //Calculate the pool
      let pool = players.reduce((a, b) => a + b["bet"], 0);
      //Assume win
      let earnings = pool;
      let winner = "P";

      if (winnerObj.type === "D") {
        //Update if not
        earnings = -players[0].bet;
        winner = "D";
      }
      console.log(winnerObj.type, earnings, winner);
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
      //Loop over every player, and reset their data
      setPlayers.map((setPlayer, i) => {
        const player = i === 0 ? true : false;
        setPlayer({
          cards: dealCards(2),
          bet: 0,
          turn: player,
          turns: 0,
          reveal: player,
          out: false,
          name: player ? "Player" : name.firstName(),
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
      <HStack>
        <VStack>
          <HStack spacing="24px">
            <Player
              player={p2}
              setPlayer={setP2}
              ai={true}
              advance={setAdvance}
              tableCards={table}
              maxBet={maxBet}
            />
            <Player
              player={p3}
              setPlayer={setP3}
              ai={true}
              advance={setAdvance}
              tableCards={table}
              maxBet={maxBet}
            />
            <Player
              player={p4}
              setPlayer={setP4}
              ai={true}
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
        <ManualStats
          bank={bank}
          runningResults={runningResults}
          runningTotal={runningTotal}
          showResult={showResult}
        />
      </HStack>
      <Flex w="full" justifyContent="flex-end">
        <Button
          colorScheme="green"
          onClick={() => {
            printReport(runningTotal, runningResults, bank);
          }}
          mr="4"
        >
          Print Report?
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            setRestart(true);
          }}
        >
          Play Again?
        </Button>
      </Flex>
    </>
  );
}
