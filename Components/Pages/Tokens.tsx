import React, { ReactElement } from "react";
import { Balance } from "../../interfaces/app";
import Hero from "../Helpers/Hero";

interface Props {
  balance: Balance;
}

export default function Tokens({ balance }: Props): ReactElement {
  return <Hero>TBD</Hero>;
}
