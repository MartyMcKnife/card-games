import React, { ReactElement } from "react";
import { Image } from "@chakra-ui/react";
import { FaceNums } from "../../interfaces/app";
import { swapCards } from "../../utils/games/general";
import ReactCardFlip from "react-card-flip";

type Colors = "blue" | "gray" | "green" | "purple" | "red" | "yellow";
export type Backings = `${Colors}_back`;
interface Props {
  cardValue: FaceNums;
  backFirst?: boolean;
  back?: Backings;
  height?: string;
  flip?: boolean;
}
export default function Card({
  cardValue,
  height,
  flip,
  backFirst = false,
  back,
}: Props): ReactElement {
  const processCard = swapCards(cardValue);
  return (
    <ReactCardFlip isFlipped={flip}>
      <Image
        src={`/cards/${
          backFirst ? back || "gray_back.png" : processCard + ".png"
        }`}
        alt={cardValue}
        height={height || "36"}
        maxWidth="full"
      />
      <Image
        src={`/cards/${
          backFirst ? processCard + ".png" : back || "gray_back.png"
        }`}
        alt={cardValue}
        height={height || "36"}
        maxWidth="full"
      />
    </ReactCardFlip>
  );
}
