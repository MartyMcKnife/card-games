import React, { ReactElement } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import BoxItem from "./BoxItem";
import CardPile from "../imgs/cardpile.png";
import SettingsIcon from "../imgs/settings.png";
import Chips from "../imgs/chips.png";
import Hero from "./Helpers/Hero";

interface Props {
  name?: string;
  balance?: number;
}

export default function Selector({ name, balance }: Props): ReactElement {
  return (
    <Hero>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading borderBottom="2px" padding={1} marginRight="8">
          Welcome, {name || "Undefined"}!
        </Heading>

        <Heading fontSize="xl" fontWeight="medium">
          Current Balance: <u>${balance || 0}</u>
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
          icon={CardPile}
          linkurl="/cardgames"
        />
        <BoxItem
          name="Tokens"
          description="Fill up your balance!"
          icon={Chips}
          linkurl="/tokens"
        />
        <BoxItem
          name="Settings"
          description="Change your username, email and more!"
          icon={SettingsIcon}
          linkurl="/settings"
        />
      </Flex>
    </Hero>
  );
}
