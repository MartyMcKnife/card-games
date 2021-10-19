import { FormLabel } from "@chakra-ui/form-control";
import { Heading, HStack, VStack, Flex } from "@chakra-ui/layout";
import React, { ReactElement, useState, useEffect } from "react";
import { offlineResults, User } from "../../../interfaces/app";
import { updateBalance } from "../../../utils/firebase/firestore";
import { getValue, initCards } from "../../../utils/games/general";
import Card from "../../Helpers/Card";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import ManualStats from "./ManualStats";
import { printReport } from "../../../utils/report";
import router from "next/router";

interface Props {
  user: User;
}

export default function AceyDeucy({ user }: Props): ReactElement {
  const dealCards = initCards();
  const [cards, setCards] = useState(dealCards(3));
  const [betAmount, setBetAmount] = useState(0);
  const [showThird, setShowThird] = useState(false);
  const [restart, setRestart] = useState(false);

  // Recording
  const [runningTotal, setRunningTotal] = useState(0);
  const [runningResults, setRunningResults] = useState<offlineResults[]>([]);
  const [bank, setBank] = useState(user.balance);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (showThird) {
      //Get first 2 cards
      const upCardsV = getValue(cards.slice(0, 2)) as number[];
      const big = Math.max(...upCardsV);
      const small = Math.min(...upCardsV);

      let earnings = -betAmount;
      let winner = "D";

      let thirdV = getValue(cards[2]) as number;

      if (thirdV >= small && thirdV <= big) {
        earnings = betAmount;
        winner = "P";
      }

      setRunningTotal(runningTotal + earnings);
      setBank(bank + earnings);
      setRunningResults([
        ...runningResults,
        {
          gain: earnings,
          winningHands: [
            {
              earnings,
              hand: cards.join(", "),
              winner,
            },
          ],
        },
      ]);
      updateBalance(user.userID, bank + earnings);
      setShowResult(true);
    }
  }, [showThird]);

  useEffect(() => {
    if (restart) {
      setCards(dealCards(3));
      setBetAmount(0);
      setShowThird(false);
      setRestart(false);
      setShowResult(false);
    }
  }, [restart]);
  return (
    <>
      <Flex w="full" justifyContent="flex-end">
        <Button
          justifySelf="flex-start"
          onClick={() => router.push("/cardgames")}
          size="xs"
        >
          Leave
        </Button>
      </Flex>
      <HStack justifyContent="space-between">
        <VStack>
          <Heading>Cards</Heading>
          <HStack pb="4">
            <Card cardValue={cards[0]} />
            <Card cardValue={cards[2]} flip={showThird} backFirst={true} />
            <Card cardValue={cards[1]} />
          </HStack>
          <HStack alignItems="flex-end">
            <div>
              <FormLabel>Bet:</FormLabel>
              <NumberInput
                min={0}
                max={250}
                onChange={(str, num) => setBetAmount(num)}
                value={betAmount}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <Button onClick={() => setShowThird(true)}>Bet!</Button>
          </HStack>
        </VStack>
        <ManualStats
          bank={bank}
          runningResults={runningResults}
          runningTotal={runningTotal}
          showResult={showResult}
        />
      </HStack>
      <Flex justifyContent="flex-end" mt="4">
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
