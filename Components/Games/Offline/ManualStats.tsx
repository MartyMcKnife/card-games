import React, { ReactElement } from "react";
import { Heading, Text, VStack } from "@chakra-ui/layout";
import { offlineResults } from "../../../interfaces/app";

interface Props {
  bank: number;
  runningResults: offlineResults[];
  runningTotal: number;
  showResult: boolean;
}

export default function ManualStats({
  bank,
  runningResults,
  runningTotal,
  showResult,
}: Props): ReactElement {
  return (
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
            runningResults.filter((hand) => hand.winningHands[0].winner === "P")
              .length
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
        (runningResults[runningResults.length - 1].winningHands[0].winner ===
        "P" ? (
          <Text textColor="green.600">Yay! You won</Text>
        ) : (
          <Text textColor="red.600">Unlucky. You lost</Text>
        ))}
    </VStack>
  );
}
