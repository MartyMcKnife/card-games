import { Flex, Heading, HStack, VStack, Text, Box } from "@chakra-ui/layout";
import React, { ReactElement, useEffect, useState } from "react";
import { Games, offlineOptions, offlineResults } from "../../../interfaces/app";
import { runGame } from "../../../utils/games/offline";
import { BarChart, Bar, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@chakra-ui/button";

interface Props {
  gameType: Games;
  options: offlineOptions;
  setSimulate: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Game({
  gameType,
  options,
  setSimulate,
}: Props): ReactElement {
  const [result, setResult] = useState<offlineResults>();
  const [data, setData] = useState<{ name: string; Wins: number }[]>();
  const [run, setRun] = useState(true);
  const [runningTotal, setRunningTotal] = useState(0);

  useEffect(() => {
    if (run) {
      const results = runGame(gameType, options);
      setResult(results);
      setRunningTotal(runningTotal + results.gain);
      console.log(results);
      let dat = [];

      results.winningHands.forEach((result) => {
        if (result.winner === "P") {
          const currentI = dat.findIndex(
            (dataPoint) => dataPoint.name === result.hand
          );
          if (currentI > -1) {
            const currentNo = dat[currentI].Wins;
            dat[currentI] = { name: result.hand, Wins: currentNo + 1 };
          } else {
            dat.push({ name: result.hand, Wins: 1 });
          }
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
        <Flex>
          <VStack mr="6">
            <Heading alignSelf="flex-start" textDecoration="underline">
              Player's Winning Hands:
            </Heading>
            {data.length > 0 ? (
              <BarChart
                data={data}
                width={500}
                height={300}
                key={Math.random()}
                margin={{ top: 20 }}
              >
                <XAxis dataKey="name" key={Math.random()} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Wins" fill="#8884d8" />
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
                Total Earnings:
              </Heading>{" "}
              <Text
                display="inline-block"
                textColor={runningTotal < 0 ? "red.600" : "green.600"}
                fontSize="lg"
              >
                ${runningTotal}
              </Text>
            </span>
          </VStack>
        </Flex>
        <Flex justifyContent="flex-end" mt="2">
          <Button colorScheme="gray" onClick={() => setSimulate(false)} mr="4">
            Change Settings
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
