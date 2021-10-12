import { Button } from "@chakra-ui/button";
import { Flex, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Fade } from "@chakra-ui/transition";
import React, { ReactElement, useState } from "react";
import { FaceNums } from "../../../../interfaces/app";
import Card from "../../../Helpers/Card";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

interface Props {
  setPlayer: React.Dispatch<
    React.SetStateAction<{
      cards: FaceNums[];
      bet: number;
      turn: boolean;
      reveal: boolean;
      out: boolean;
    }>
  >;
  player: {
    cards: FaceNums[];
    bet: number;
    turn: boolean;
    reveal: boolean;
    out: boolean;
  };
  ai: boolean;
  name?: string;
  advance: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Player({
  player,
  setPlayer,
  ai,
  name,
  advance,
}: Props): ReactElement {
  const [raise, setRaise] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(50);

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
          <Button isDisabled={player.out} onClick={() => setRaise(!raise)}>
            Raise
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
              setPlayer({ ...player, bet: player.bet + raiseAmount });
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
