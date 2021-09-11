import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Fade } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { MoreMoney, Values } from "../../interfaces/app";
import Token from "./Token";

interface Props {
  value: Values;
  setAmount: React.Dispatch<React.SetStateAction<MoreMoney>>;
  amount: MoreMoney;
}

export default function PurchaseToken({
  value,
  setAmount,
  amount,
}: Props): ReactElement {
  const ia = amount[value].increaseAmount;
  const ca = amount[value].currentAmount;
  return (
    <HStack>
      <Token faceValue={value} width="5rem" />
      <VStack>
        <HStack spacing="3px">
          <Heading size="sm" whiteSpace="nowrap">
            Current Amount:
          </Heading>

          <Text>{ca || 0}</Text>
        </HStack>
        <HStack spacing="3px" alignItems="baseline">
          <Heading size="sm" whiteSpace="nowrap">
            Amount to add:
          </Heading>

          <Text>{ia || 0}</Text>
          <Fade in={ia > 0}>
            <Text fontSize="0.7rem" textColor="gray.500">
              (${ia * (parseInt(value) / 100)})
            </Text>
          </Fade>
        </HStack>
      </VStack>
    </HStack>
  );
}
