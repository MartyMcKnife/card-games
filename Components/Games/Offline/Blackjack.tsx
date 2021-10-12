import { useDisclosure } from "@chakra-ui/hooks";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React, { ReactElement, useState, useEffect } from "react";
import { FaceNums, offlineResults, User } from "../../../interfaces/app";
import { updateBalance } from "../../../utils/firebase/firestore";
import { getMax, getValue, initCards } from "../../../utils/games/general";
import { printReport } from "../../../utils/report";
import Card from "../../Helpers/Card";
import BetAmount from "./BetAmount";
import ManualStats from "./ManualStats";

interface Props {
  user: User;
}

export default function Blackjack({ user }: Props): ReactElement {
  const dealCards = initCards();

  const [pCards, setPCards] = useState<FaceNums[]>([]);
  const [dCards, setDCards] = useState<FaceNums[]>([]);
  const [restart, setRestart] = useState(true);

  //Game
  const [hit, setHit] = useState(false);
  const [stand, setStand] = useState(false);
  const [bust, setBust] = useState(false);
  const [dTurn, setDTurn] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);

  //Recording
  const [runningTotal, setRunningTotal] = useState(0);
  const [runningResults, setRunningResults] = useState<offlineResults[]>([]);
  const [bank, setBank] = useState(user.balance);
  const [betAmount, setBetAmount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  //Betting
  const [updateBetAmount, setUpdateBetAmount] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Deal our cards
  useEffect(() => {
    if (restart) {
      setPCards(dealCards(2));
      setDCards(dealCards(2));
      setHit(false);
      setStand(false);
      setBust(false);
      setDTurn(false);
      setShowResult(false);
      setGameEnd(false);
    }
    setRestart(false);
  }, [restart]);

  useEffect(() => {
    if (updateBetAmount) {
      onOpen();
      setUpdateBetAmount(false);
    }
  }, [updateBetAmount]);

  useEffect(() => {
    if (hit) {
      const newHand = [...pCards, ...dealCards(1)];
      setPCards(newHand);
      const val = getValue(newHand, true, 10) as number;
      // Check to see if busted
      if (val > 21) {
        setBust(true);
        setStand(true);
      }
      setHit(false);
    }
  }, [hit]);

  useEffect(() => {
    if (stand) {
      setDTurn(true);
      let dHand = dCards;
      let dVal = getValue(dHand, true, 10) as number;
      let dAceCheck = (getValue(dHand, null, 10) as number[]).includes(1);
      //If we have an ace high, we can use this to calculate it
      let dHighVal = dAceCheck ? dVal + 10 : dVal;
      //Loop until dealer's cards are below 17
      while (dHighVal < 17 || dVal < 17) {
        dHand = [...dCards, ...dealCards(1)];
        dVal = getValue(dHand, true, 10) as number;
        dAceCheck = (getValue(dHand, null, 10) as number[]).includes(1);
        dHighVal = dAceCheck ? dVal + 10 : dVal;
        setDCards(dHand);
      }

      //Check winners
      const pVal = getValue(pCards, true, 10) as number;
      const pAceCheck = (getValue(pCards, null, 10) as number[]).includes(1);
      //If we have an ace high, we can use this to calculate it
      const pHighVal = pAceCheck ? pVal + 10 : pVal;
      //Assume loss
      let bet = -betAmount;
      let winner = "D";
      let winningHand = dHand;
      //Check if won
      if (
        dVal > 21 ||
        getMax([pVal, pHighVal], 21) > getMax([dVal, dHighVal], 21)
      ) {
        bet = betAmount;
        winner = "P";
        winningHand = pCards;
      }
      setRunningTotal(runningTotal + bet);
      setBank(bank + bet);
      setRunningResults([
        ...runningResults,
        {
          gain: bet,
          winningHands: [
            {
              earnings: bet,
              hand: winningHand.join(", "),
              winner,
            },
          ],
        },
      ]);
      updateBalance(user.userID, bank + bet);
      setShowResult(true);
      setGameEnd(true);
    }
  }, [stand]);

  //Dealing cards takes time
  if (pCards.length > 0 && dCards.length > 0) {
    return (
      <>
        <HStack
          spacing="24px"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box minW="60%">
            <Center>
              <VStack>
                <Heading fontSize="lg">Dealer's cards</Heading>
                <HStack>
                  {dTurn ? (
                    dCards.map((card, i) => (
                      <Card cardValue={card} key={card + i} />
                    ))
                  ) : (
                    <>
                      <Card cardValue={dCards[0]} />{" "}
                      <Card cardValue="gray_back" />
                    </>
                  )}
                </HStack>
              </VStack>
            </Center>
            <Center mt="4">
              <VStack>
                <Heading fontSize="lg">Your cards</Heading>
                <HStack>
                  {pCards.map((card) => (
                    <Card cardValue={card} key={card} />
                  ))}
                </HStack>
                <HStack>
                  {" "}
                  <Button
                    onClick={() => setHit(true)}
                    isDisabled={bust || gameEnd}
                  >
                    Hit
                  </Button>
                  <Button
                    onClick={() => setStand(true)}
                    isDisabled={bust || gameEnd}
                  >
                    Stand
                  </Button>
                </HStack>
                {bust && (
                  <Text fontWeight="bold" textColor="red.600">
                    Unlucky! You busted!
                  </Text>
                )}
              </VStack>
            </Center>
          </Box>
          <ManualStats
            runningResults={runningResults}
            runningTotal={runningTotal}
            showResult={showResult}
            bank={bank}
          />
        </HStack>
        <Flex w="full" justifyContent="flex-end" mt="4">
          <Button
            colorScheme="gray"
            onClick={() => setUpdateBetAmount(true)}
            mr="4"
          >
            Change Bet
          </Button>
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
        <BetAmount
          setBetAmount={setBetAmount}
          isOpen={isOpen}
          onClose={onClose}
          betAmount={betAmount}
        />
      </>
    );
  }
  return null;
}
