import React, { ReactElement } from "react";
import { FaceNums, FaceValues } from "../../../../interfaces/app";

interface Props {
  setBet: React.Dispatch<React.SetStateAction<number>>;
  cards: FaceNums[];
}

export default function Player({}: Props): ReactElement {
  return <div></div>;
}
