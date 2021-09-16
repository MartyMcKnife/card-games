import React, { ReactElement } from "react";
import { useRouter } from "next/router";

export default function blackjack(): ReactElement {
  const router = useRouter();
  const online = (router.query["offline"] as string) === "false";
  if (online) {
    return <p>online</p>;
  } else {
    return <p>offline</p>;
  }
}
