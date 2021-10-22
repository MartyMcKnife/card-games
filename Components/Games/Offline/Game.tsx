import { Flex, Heading, HStack, VStack, Text, Box } from "@chakra-ui/layout";
import React, { ReactElement, useEffect, useState } from "react";
import { Games, offlineOptions, offlineResults } from "../../../interfaces/app";
import { runGame } from "../../../utils/games/offline";
import { BarChart, Bar, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@chakra-ui/button";
import useAsyncEffect from "use-async-effect";
import { updateBalance } from "../../../utils/firebase/firestore";
import { printReport } from "../../../utils/report";
import router from "next/router";

interface Props {
  gameType: Games;
  options: offlineOptions;
  setSimulate: React.Dispatch<React.SetStateAction<boolean>>;
  bal: number;
  uid: string;
  manual: boolean;
}

export default function Game({
  gameType,
  options,
  setSimulate,
  bal,
  uid,
}: Props): ReactElement {
  const [result, setResult] = useState<offlineResults>();
  const [runningResult, setRunningResult] = useState<offlineResults[]>([]);
  const [data, setData] = useState<{ name: string; Wins: number }[]>([]);
  const [run, setRun] = useState(true);
  const [runningTotal, setRunningTotal] = useState(0);
  const [bank, setBank] = useState(bal);

  useAsyncEffect(async () => {
    if (run) {
      const results = runGame(gameType, options);
      setResult(results);
      setRunningResult([...runningResult, results]);
      setRunningTotal(runningTotal + results.gain);
      setBank(bank + results.gain);
      await updateBalance(uid, bank + results.gain);
      let dat: Array<{ name: string; Player: number; Dealer: number }> = [];
      //Generate the data for the graph
      results.winningHands.forEach((result) => {
        //Work out who won
        const winner = result.winner === "P" ? "Player" : "Dealer";
        //Stupid implementation to not update the other data point because its late and im tired and cant think
        const loser = result.winner === "D" ? "Player" : "Dealer";
        //Check if we currently have a data point
        const currentI = dat.findIndex(
          (dataPoint) => dataPoint.name === result.hand
        );
        //If we do, update it
        if (currentI > -1) {
          const currentNo = dat[currentI][winner];
          // @ts-ignore
          dat[currentI] = {
            name: result.hand,
            [winner]: currentNo + 1,
            [loser]: dat[currentI][loser],
          };
        } else {
          //Create a data point
          // @ts-ignore
          dat.push({ name: result.hand, [winner]: 1, [loser]: 0 });
        }
      });
      console.log(dat);
      //@ts-ignore
      setData(dat.sort((a, b) => a.name - b.name));
      setRun(false);
    }
  }, [run]);

  if (result) {
    return (
      <Box>
        <Flex w="full" justifyContent="flex-end">
          <Button
            justifySelf="flex-start"
            onClick={() => router.push("/cardgames")}
            size="xs"
          >
            Leave
          </Button>
        </Flex>

        <Flex>
          <VStack mr="6">
            <Heading alignSelf="flex-start" textDecoration="underline">
              Player's Winning Hands:
            </Heading>
            {data.length > 0 ? (
              <BarChart
                data={data}
                width={600}
                height={300}
                key={Math.random()}
                margin={{ top: 20 }}
              >
                <XAxis dataKey="name" key={Math.random()} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Player" stackId="a" fill="#2EC0F9" />
                <Bar dataKey="Dealer" stackId="a" fill="#67AAF9" />
              </BarChart>
            ) : (
              <VStack h="full" w="full" justifyContent="center">
                <Text textDecoration="italic">You didn't win anything!</Text>
              </VStack>
            )}
          </VStack>

          <VStack alignItems="flex-start">
            <Heading textDecoration="underline" mb="8">
              Stats:
            </Heading>

            <span>
              <Heading fontSize="lg" display="inline-block">
                Games Played:
              </Heading>{" "}
              <Text display="inline-block" fontSize="lg">
                {result.winningHands.length}
              </Text>
            </span>
            <span>
              <Heading fontSize="lg" display="inline-block">
                Games Won:
              </Heading>{" "}
              <Text display="inline-block" fontSize="lg">
                {
                  result.winningHands.filter((hand) => hand.winner === "P")
                    .length
                }
              </Text>
            </span>
            <span>
              <Heading fontSize="lg" display="inline-block">
                Money {result.gain < 0 ? "Lost" : "Won"}:
              </Heading>{" "}
              <Text
                display="inline-block"
                textColor={result.gain < 0 ? "red.600" : "green.600"}
                fontSize="lg"
              >
                ${Math.abs(result.gain)}
              </Text>
            </span>
            <span>
              <Heading fontSize="lg" display="inline-block">
                Total Earnings for the game:
              </Heading>{" "}
              <Text
                display="inline-block"
                textColor={runningTotal < 0 ? "red.600" : "green.600"}
                fontSize="lg"
              >
                ${runningTotal}
              </Text>
            </span>
            <span>
              <Heading fontSize="lg" display="inline-block">
                Bank Balance:
              </Heading>{" "}
              <Text
                display="inline-block"
                textColor={bank < 0 ? "red.600" : "green.600"}
                fontSize="lg"
              >
                ${bank}
              </Text>
            </span>
          </VStack>
        </Flex>
        <Flex justifyContent="flex-end" mt="2">
          <Button colorScheme="gray" onClick={() => setSimulate(false)} mr="4">
            Change Settings
          </Button>
          <Button
            colorScheme="green"
            onClick={() => {
              printReport(runningTotal, runningResult, bank);
            }}
            mr="4"
          >
            Print Report?
          </Button>
          <Button colorScheme="blue" onClick={() => setRun(true)}>
            Run Again?
          </Button>
        </Flex>
      </Box>
    );
  } else {
    return null;
  }
}
