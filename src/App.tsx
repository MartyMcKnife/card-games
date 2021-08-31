import * as React from "react";
import { Flex, Box, Heading, SimpleGrid } from "@chakra-ui/react";
import BoxItem from "./Components/BoxItem";
import CardPile from "./imgs/cardpile.png";
import Settings from "./imgs/settings.png";

export const App = () => (
  <Box bgColor="gray.50" height="screen-h">
    <Flex justify="center" alignItems="center" height="full">
      <Box shadow="lg" alignItems="center" padding="8" rounded="lg">
        <Heading borderBottom="2px" padding={1}>
          Welcome Steve!
        </Heading>
        <SimpleGrid
          columns={2}
          spacing={10}
          marginTop="4"
          marginX="auto"
          width="full"
        >
          <BoxItem
            name="Card Games!"
            description="Chose and start a game here!"
            icon={CardPile}
          />
          <BoxItem
            name="Settings"
            description="Change your username, email and more!"
            icon={Settings}
          />
        </SimpleGrid>
      </Box>
    </Flex>
  </Box>
);
