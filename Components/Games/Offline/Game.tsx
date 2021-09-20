import { HStack } from "@chakra-ui/layout";
import React, { ReactElement, useEffect, useState } from "react";
import { Games, offlineOptions, offlineResults } from "../../../interfaces/app";
import { runGame } from "../../../utils/games/offline";

interface Props {
  gameType: Games;
  options: offlineOptions;
}

export default function Game({ gameType, options }: Props): ReactElement {
  const [result, setResult] = useState<offlineResults>();
  const [data, setData] = useState<{ name: string; val: number }[]>();
  useEffect(() => {
    const results = runGame(gameType, options);
    setResult(results);
    let dat = data;
    results.winningHands.forEach((result) => {});
  }, []);
  return <HStack></HStack>;
}
