import React, { ReactElement, useState, useEffect } from "react";
import { User } from "../interfaces/app";
import { Flex, Heading } from "@chakra-ui/react";
import BoxItem from "./BoxItem";
import Hero from "./Helpers/Hero";

interface Props {
  user: User;
}

export default function Landing({ user }: Props): ReactElement {
  const [totalBalance, setotalBalance] = useState<number>();
  useEffect(() => {
    let total = 0;
    const balance = user.balance;
    for (const value in balance) {
      const chips: number = balance[value];
      total += parseInt(value) * chips;
    }
    setotalBalance(total);
  }, [user.balance]);

  return (
    <Hero>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading borderBottom="2px" padding={1} marginRight="8">
          Welcome, {user.userName || "Undefined"}!
        </Heading>

        <Heading fontSize="xl" fontWeight="medium">
          Current Balance: <u>${totalBalance || 0}</u>
        </Heading>
      </Flex>

      <Flex
        alignItems="center"
        justifyContent="space-around"
        marginTop="4"
        width="full"
      >
        <BoxItem
          name="Card Games!"
          description="Chose and start a game here!"
          icon="/imgs/cardpile.png"
          linkurl="/cardgames"
        />
        <BoxItem
          name="Tokens"
          description="Fill up your balance!"
          icon="/imgs/chips.png"
          linkurl="/tokens"
        />
        <BoxItem
          name="Settings"
          description="Change your username, email and more!"
          icon="/imgs/settings.png"
          linkurl="/settings"
        />
      </Flex>
    </Hero>
  );
}
