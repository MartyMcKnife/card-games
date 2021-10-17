import { Flex, HStack, VStack } from "@chakra-ui/layout";
import { SlideFade } from "@chakra-ui/transition";
import React, { ReactElement, useState, useEffect } from "react";
import { offlineResults, User } from "../../../interfaces/app";
import { updateBalance } from "../../../utils/firebase/firestore";
import { flipCoins } from "../../../utils/games/general";
import Coin from "../../Helpers/Coin";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FormControl, FormLabel, Button } from "@chakra-ui/react";
import ManualStats from "./ManualStats";
import { printReport } from "../../../utils/report";
import { Select } from "@chakra-ui/react";
import router from "next/router";

interface Props {
  user: User;
}
type Faces = "H" | "T";
export default function Twoup({ user }: Props): ReactElement {
  //Game
  const [playerBet, setPlayerBet] = useState(10);
  const [playerBetFace, setPlayerBetFace] = useState<Array<string>>([]);
  const [run, setRun] = useState(false);
  const [flip, setFlip] = useState(false);
  const [result, setResult] = useState<Array<Faces>>(["H", "H"]);
  const [betCheck, setBetCheck] = useState(false);

  //Recording
  const [runningTotal, setRunningTotal] = useState(0);
  const [runningResults, setRunningResults] = useState<offlineResults[]>([]);
  const [bank, setBank] = useState(user.balance);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (run) {
      if (playerBetFace.length < 1) {
        setBetCheck(true);
        return;
      }
      setShowResult(false);
      const coins = flipCoins(2);
      setResult(coins);
      setFlip(true);
      // Assum won
      let bet = playerBet;
      let winner = "P";
      // If we didn't, update bet
      if (!playerBetFace.includes(coins.join(""))) {
        bet = -playerBet;
        winner = "D";
      }

      const newBank = bank + bet;
      setBank(newBank);
      updateBalance(user.userID, newBank);
      setRunningTotal(runningTotal + bet);
      setRunningResults([
        ...runningResults,
        {
          gain: bet,
          winningHands: [{ earnings: bet, hand: coins.join(), winner }],
        },
      ]);
      setShowResult(true);
      setRun(false);
    }
  }, [run]);

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
      <Flex w="full" justifyContent="space-between" alignItems="center">
        <VStack>
          <HStack mb="4">
            <Coin coin={result[0]} />
            <Coin coin={result[1]} />
          </HStack>

          <VStack alignItems="flex-start">
            <Flex alignItems="center">
              <FormLabel>Bet Amount:</FormLabel>
              <NumberInput
                maxW="100px"
                mr="2rem"
                value={playerBet}
                onChange={(str, num) => {
                  setPlayerBet(num);
                }}
                size="sm"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex alignItems="center">
              <FormLabel>Face:</FormLabel>
              <Select
                placeholder="Select a face"
                onChange={(val) => {
                  setPlayerBetFace(val.target.value.split(","));
                  setBetCheck(false);
                }}
                isInvalid={betCheck}
                size="sm"
              >
                <option value="HH">Heads, Heads</option>
                <option value="TT">Tails, Tails</option>
                <option value="HT,TH">Heads, Tails</option>
              </Select>
            </Flex>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => {
                setRun(true);
              }}
            >
              Flip!
            </Button>
          </VStack>
        </VStack>
        <ManualStats
          runningResults={runningResults}
          runningTotal={runningTotal}
          showResult={showResult}
          bank={bank}
        />
      </Flex>
      <Flex w="full" justifyContent="flex-end" mt="2">
        <Button
          colorScheme="green"
          onClick={() => {
            printReport(runningTotal, runningResults, bank);
          }}
          mr="4"
        >
          Print Report?
        </Button>
      </Flex>
    </>
  );
}
