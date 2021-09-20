import React, { ReactElement } from "react";
import { Image } from "@chakra-ui/react";
import { FaceValues, Nums } from "../../interfaces/app";

interface Props {
  faceValue?: FaceValues;
  number?: Nums;
  width?: string;
  random?: boolean;
}
const faces = ["C", "S", "H", "D"];
export default function Card({
  faceValue = "C",
  number = 1,
  width,
  random,
}: Props): ReactElement {
  let face = faceValue;
  let num = number;
  if (random) {
    face = faces[Math.round(Math.random() * 3)] as "C" | "S" | "H" | "D";
    num = Math.ceil(Math.random() * 13);
  }
  const cardName = num + face + ".png";
  return (
    <Image
      src={require(`../../public/Cards/${cardName}`).default}
      alt={face + num}
      width={width || "10rem"}
    />
  );
}
