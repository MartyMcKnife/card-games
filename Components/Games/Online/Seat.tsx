import { Image } from "@chakra-ui/image";
import { Flex, VStack, Text, Heading } from "@chakra-ui/layout";
import React, { ReactElement } from "react";

interface Props {
  bal: number;
  name: string;
  active: boolean;
}

export default function Seat({ bal, name, active }: Props): ReactElement {
  return (
    <VStack>
      <Flex alignItems="center">
        <VStack justifyContent="center" alignItems="center">
          <Text fontSize="md" fontStyle="italic">
            {bal}
          </Text>
          <Image src="/imgs/coins.png" maxW="auto" h="14" />
        </VStack>
        <Image src="/imgs/man-user.png" maxW="auto" h="16" />
      </Flex>
      <Heading fontSize="md" textDecoration={active ? "underline" : ""}>
        {name}
      </Heading>
    </VStack>
  );
}
