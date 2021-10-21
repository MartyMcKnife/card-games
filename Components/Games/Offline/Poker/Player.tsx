import { Button } from "@chakra-ui/button";
import { Flex, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Fade } from "@chakra-ui/transition";
import React, { ReactElement, useState, useEffect } from "react";
import { FaceNums } from "../../../../interfaces/app";
import Card from "../../../Helpers/Card";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { processHand, turnToTable } from "../../../../utils/games/general";
import random from "random-seedable";
import * as ps from "pokersolver";
const Hand = ps.Hand;

interface Props {
  setPlayer: React.Dispatch<
    React.SetStateAction<{
      cards: FaceNums[];
      bet: number;
      turn: boolean;
      turns: number;
      reveal: boolean;
      out: boolean;
      name: string;
    }>
  >;
  player: {
    cards: FaceNums[];
    bet: number;
    turn: boolean;
    turns: number;
    reveal: boolean;
    out: boolean;
    name: string;
  };
  ai: boolean;
  advance: React.Dispatch<React.SetStateAction<boolean>>;
  tableCards: { card: FaceNums; show: boolean }[];
  maxBet: number;
}

export default function Player({
  player,
  setPlayer,
  ai,
  advance,
  tableCards,
  maxBet,
}: Props): ReactElement {
  const [raise, setRaise] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(50);
  const [call, setCall] = useState(false);
  useEffect(() => {
    if (player.turn && ai && player.turns < 4) {
      //Check how many cards are up on the table
      const showCards = turnToTable(player.turns);
      //And get them
      const table = tableCards
        .map((card, i) => {
          if (i < showCards) {
            return card.card;
          }
        })
        .filter((card) => card !== undefined);
      const hand = [...player.cards, ...table];

      const processedHand = processHand(hand);
      const solved = Hand.solve(processedHand);
      if (player.bet < maxBet && player.turns === 0) {
        //Call first turn
        setPlayer({ ...player, bet: maxBet });
      } else {
        if (player.bet < maxBet && solved.rank > 1) {
          //Always call if good hand
          setPlayer({ ...player, bet: maxBet });
          console.log("call");
        } else if (solved.rank > 1) {
          //Raise if good hand
          setPlayer({
            ...player,
            bet: player.bet + random.randRange(1, 150),
          });
          console.log("raise");
        } else if (player.turns > 0) {
          //Fold if we haven't gotten a good hand yet
          setPlayer({ ...player, out: true });
          console.log("fold");
        }
      }
      advance(true);
    }
  }, [ai, player]);
  useEffect(() => {
    if (player.bet !== maxBet) {
      setCall(true);
    }
  }, [maxBet]);
  return (
    <VStack>
      <Heading fontSize="2xl">{player.name || "Player"}'s Cards</Heading>
      <HStack>
        {/* <Card cardValue={player.reveal ? player.cards[0] : "gray_back"} />
        <Card cardValue={player.reveal ? player.cards[1] : "gray_back"} /> */}
      </HStack>
      <HStack>
        <Heading fontSize="lg">Bet:</Heading>
        <Text>{player.bet}</Text>
      </HStack>
      {/* Only render the buttons if it's our player */}
      {!ai && (
        <HStack>
          <Button
            isDisabled={player.out}
            onClick={() => {
              if (call) {
                setPlayer({ ...player, bet: maxBet });
                advance(true);
              } else {
                setRaise(!raise);
              }
            }}
          >
            {call ? "Call" : "Raise"}
          </Button>
          <Button onClick={() => advance(true)} isDisabled={player.out || call}>
            Check
          </Button>
          <Button
            onClick={() => {
              setPlayer({ ...player, out: true });
              advance(true);
            }}
            isDisabled={player.out}
          >
            Fold
          </Button>
        </HStack>
      )}
      <Fade in={raise} hidden={!raise}>
        <HStack w="max-content" spacing="24px">
          <Slider
            aria-label="slider-raise"
            min={1}
            max={250}
            defaultValue={50}
            onChange={(val) => setRaiseAmount(val)}
            w="36"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb children={raiseAmount} fontSize="sm" boxSize={8} />
          </Slider>
          <Button
            onClick={() => {
              setPlayer({
                ...player,
                bet: player.bet + raiseAmount,
              });
              setRaise(false);
              advance(true);
            }}
            variant="outline"
            size="xs"
          >
            Raise!
          </Button>
        </HStack>
      </Fade>
    </VStack>
  );
}
