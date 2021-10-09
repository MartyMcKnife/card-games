import React, { ReactElement } from "react";
import { Image } from "@chakra-ui/react";
import { FaceNums } from "../../interfaces/app";
import { swapCards } from "../../utils/games/general";

type Colors = "blue" | "gray" | "green" | "purple" | "red" | "yellow";
export type Backings = `${Colors}_back`;
interface Props {
  cardValue: FaceNums | Backings;
  height?: string;
}
export default function Card({ cardValue, height }: Props): ReactElement {
  let cardName: string;
  //Check whether we need to switch the cards around
  if (cardValue.includes("_back")) {
    cardName = cardValue + ".png";
  } else {
    //Typescript gets grumpy because we havent type-checked, but we know its fine
    // @ts-ignore
    cardName = swapCards(cardValue) + ".png";
  }

  return (
    <Image
      src={`/cards/${cardName}`}
      alt={cardValue}
      height={height || "36"}
      maxWidth="full"
    />
  );
}
