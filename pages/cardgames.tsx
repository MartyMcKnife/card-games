import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box, Flex, Heading, HStack, SimpleGrid } from "@chakra-ui/layout";
import { Switch } from "@chakra-ui/switch";
import React, { ReactElement, useState } from "react";
import BoxItem from "../Components/BoxItem";
import Hero from "../Components/Helpers/Hero";

export default function cardgames(): ReactElement {
  const [offline, setOffline] = useState(false);
  return (
    <Hero>
      <Flex justifyContent="space-between" alignItems="center" width="full">
        <Heading>Games</Heading>
        <Box display="flex" alignItems="center">
          <FormLabel htmlFor="offline" mb="0" fontSize="sm">
            Offline Mode?
          </FormLabel>
          <Switch
            id="offline"
            mb="0"
            size="sm"
            onChange={() => setOffline(!offline)}
          />
        </Box>
      </Flex>
      <SimpleGrid columns={[2, 3]} mt="4" w="full">
        <BoxItem
          name="Blackjack"
          icon="/imgs/blackjack.png"
          description="A simple, but fun, 2 card game!"
          linkurl={`/games/blackjack?offline=${offline}`}
        />
        <BoxItem
          name="Texas Hold 'Em"
          icon="/imgs/poker.png"
          description="A very popular variation of poker!"
          linkurl={`/games/poker?offline=${offline}`}
        />
      </SimpleGrid>
    </Hero>
  );
}
