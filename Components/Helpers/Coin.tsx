import { Image } from "@chakra-ui/react";
import React, { ReactElement, useState, useEffect } from "react";
import FlipCoin from "react-flipcoin";

interface Props {
  coin: "H" | "T";
  height?: number;
}

export default function Coin({ coin, height }: Props): ReactElement {
  const coins = [
    { name: "Heads", photo: "/coins/H.png" },
    { name: "Tails", photo: "/coins/T.png" },
  ];
  const winnerPos = coin === "H" ? 0 : 1;
  return (
    <Image
      src={`/coins/${coin}.png`}
      alt={coin}
      height={height || "36"}
      maxWidth="full"
    />
  );
}
