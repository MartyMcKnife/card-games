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
    }>
  >;
  player: {
    cards: FaceNums[];
    bet: number;
    turn: boolean;
    turns: number;
    reveal: boolean;
    out: boolean;
  };
  ai: boolean;
  name?: string;
  advance: React.Dispatch<React.SetStateAction<boolean>>;
  tableCards: { card: FaceNums; show: boolean }[];
  maxBet: number;
}

export default function Player({
  player,
  setPlayer,
  ai,
  name,
  advance,
  tableCards,
  maxBet,
}: Props): ReactElement {
  const [raise, setRaise] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(50);
  const [call, setCall] = useState(false);
  useEffect(() => {
    if (player.turn && ai) {
      //Check how many cards are up on the table
      const showCards = turnToTable(player.turns);
      const table = tableCards.map((card, i) => {
        if (i < showCards) {
          return card.card;
        }
      });
      const hand = [...player.cards, ...table];
      console.log(player.cards, table, hand);

      const processedHand = processHand(hand);
      const solved = Hand.solve(processedHand);
      if (player.bet < maxBet && solved.rank > 0) {
        //Always call if good hand
        setPlayer({ ...player, bet: maxBet });
      } else if (solved.rank > 0) {
        //Raise if good hand
        setPlayer({
          ...player,
          bet: player.bet + Math.round(Math.random() * 50),
        });
      } else if (player.turns > 0) {
        //Fold if we haven't gotten a good hand yet
        setPlayer({ ...player, out: true });
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
      <Heading fontSize="2xl">{name || "Player"}'s Cards</Heading>
      <HStack>
        <Card cardValue={player.reveal ? player.cards[0] : "gray_back"} />
        <Card cardValue={player.reveal ? player.cards[1] : "gray_back"} />
      </HStack>
      <HStack>
        <Heading fontSize="lg">Bet:</Heading>
        <Text>{player.bet}</Text>
      </HStack>
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
          <Button onClick={() => advance(true)} isDisabled={player.out}>
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
              advance(true);
            }}
            variant="outline"
            size="sm"
          >
            Raise!
          </Button>
        </HStack>
      </Fade>
    </VStack>
  );
}
