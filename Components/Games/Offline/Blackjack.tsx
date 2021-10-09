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
import {
  FaceNums,
  FaceValues,
  offlineResults,
  User,
} from "../../../interfaces/app";
import { getMax, getValue, initCards } from "../../../utils/games/general";
import { printReport } from "../../../utils/report";
import Card from "../../Helpers/Card";
import BetAmount from "./BetAmount";

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

      while (dHighVal < 17 && dVal < 17) {
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
      console.log(dHand, dVal, dHighVal, pCards, pVal, pHighVal);
      if (
        dVal > 21 ||
        getMax([pVal, pHighVal], 21) > getMax([dVal, dHighVal], 21)
      ) {
        setRunningTotal(runningTotal + betAmount);
        setBank(bank + betAmount);
        setRunningResults([
          ...runningResults,
          {
            gain: betAmount,
            winningHands: [
              {
                earnings: betAmount,
                hand: pCards.join(", "),
                winner: "P",
              },
            ],
          },
        ]);
      } else {
        setRunningTotal(runningTotal - betAmount);
        setBank(bank - betAmount);
        setRunningResults([
          ...runningResults,
          {
            gain: -betAmount,
            winningHands: [
              {
                earnings: -betAmount,
                hand: pCards.join(", "),
                winner: "D",
              },
            ],
          },
        ]);
      }
    }
    setShowResult(true);
    console.log(runningResults);
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
                  <Button onClick={() => setHit(true)} isDisabled={bust}>
                    Hit
                  </Button>
                  <Button onClick={() => setStand(true)} isDisabled={bust}>
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
          <VStack alignItems="flex-start">
            <Heading textDecoration="underline" mb="2">
              Stats:
            </Heading>

            <span>
              <Heading fontSize="md" display="inline-block">
                Games Played:
              </Heading>{" "}
              <Text display="inline-block" fontSize="md">
                {runningResults.length}
              </Text>
            </span>
            <span>
              <Heading fontSize="md" display="inline-block">
                Games Won:
              </Heading>{" "}
              <Text display="inline-block" fontSize="md">
                {
                  runningResults.filter(
                    (hand) => hand.winningHands[0].winner === "P"
                  ).length
                }
              </Text>
            </span>
            <span>
              <Heading fontSize="md" display="inline-block">
                Session Earnings:
              </Heading>{" "}
              <Text
                display="inline-block"
                textColor={runningTotal < 0 ? "red.600" : "green.600"}
                fontSize="md"
              >
                ${runningTotal}
              </Text>
            </span>
            <span>
              <Heading fontSize="md" display="inline-block">
                Bank Balance:
              </Heading>{" "}
              <Text
                display="inline-block"
                textColor={bank < 0 ? "red.600" : "green.600"}
                fontSize="md"
              >
                ${bank}
              </Text>
            </span>
            {showResult &&
              runningResults.length > 0 &&
              (runningResults[runningResults.length - 1].winningHands[0]
                .winner === "P" ? (
                <Text textColor="green.600">Yay! You won</Text>
              ) : (
                <Text textColor="red.600">Unlucky. You lost</Text>
              ))}
          </VStack>
        </HStack>
        <Flex w="full" justifyContent="flex-end" mt="4">
          <Button
            colorScheme="gray"
            onClick={() => setUpdateBetAmount(true)}
            mr="4"
          >
            Change Settings
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
        />
      </>
    );
  }
  return null;
}