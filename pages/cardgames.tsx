import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box, Flex, Heading, HStack, SimpleGrid } from "@chakra-ui/layout";
import { Switch } from "@chakra-ui/switch";
import React, { ReactElement, useState } from "react";
import BoxItem from "../Components/BoxItem";
import Hero from "../Components/Helpers/Hero";
import { useToast } from "@chakra-ui/react";

export default function cardgames(): ReactElement {
  const [manual, setManual] = useState(false);
  const toast = useToast();

  return (
    <Hero>
      <Flex justifyContent="space-between" alignItems="center" width="full">
        <Heading>Games</Heading>
        <Box display="flex" alignItems="center">
          <FormLabel htmlFor="manual" mb="0" fontSize="sm">
            Manual Mode?
          </FormLabel>
          <Switch
            id="manual"
            mb="0"
            size="sm"
            onChange={() => setManual(!manual)}
            isChecked={manual}
          />
        </Box>
      </Flex>
      <SimpleGrid columns={[2, 3]} mt="4" w="full" gap="4">
        <BoxItem
          name="Blackjack"
          icon="/imgs/blackjack.png"
          description="A simple, but fun, 2 card game!"
          linkurl={`/games/blackjack?manual=${manual}`}
        />
        <BoxItem
          name="Texas Hold 'Em"
          icon="/imgs/poker.png"
          description="A very popular variation of poker!"
          linkurl={manual ? "" : `/games/poker?manual=${manual}`}
          onClick={() => {
            if (manual) {
              toast({
                title: "Manual mode is not available for Texas Hold 'Em",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "bottom-right",
              });
            }
          }}
        />
        <BoxItem
          name="Two up"
          icon="/imgs/coin.png"
          description="A popular Australian coin game!"
          linkurl={`/games/twoup?manual=${manual}`}
        />
        <BoxItem
          name="Acey Deucy"
          icon="/imgs/playing-card.png"
          description="A simple, card guessing game!"
          linkurl={`/games/aceydeucy?manual=${manual}`}
        />
      </SimpleGrid>
    </Hero>
  );
}
