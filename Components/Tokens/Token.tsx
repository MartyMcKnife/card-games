import React, { ReactElement } from "react";
import { Image } from "@chakra-ui/react";
import { Values } from "../../interfaces/app";

interface Props {
  faceValue: Values;
  width?: string;
}

export default function Token({ faceValue, width }: Props): ReactElement {
  const tokenName = faceValue + ".png";
  return (
    <Image
      src={`/chips/${tokenName}`}
      alt={faceValue + "chip"}
      width={width || "10rem"}
    />
  );
}
