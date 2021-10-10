import { Image } from "@chakra-ui/react";
import React, { ReactElement } from "react";

interface Props {
  coin: "H" | "T";
  height?: number;
}

export default function Coin({ coin, height }: Props): ReactElement {
  return (
    <Image
      src={"/coins/" + coin + ".png"}
      alt={coin}
      maxW="full"
      height={height || "32"}
    />
  );
}
