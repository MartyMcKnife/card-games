import React, { ReactElement, useEffect, useState } from "react";
import { Games, offlineOptions } from "../../../interfaces/app";
import { returnStruct, runGame } from "../../../utils/games/offline";

interface Props {
  gameType: Games;
  options: offlineOptions;
}

export default function Game({ gameType, options }: Props): ReactElement {
  const [result, setResult] = useState<returnStruct>();
  useEffect(() => {
    setResult(runGame(gameType, options));
  }, []);
  console.log(result);
  return <div></div>;
}
