import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import {
  Fade,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
} from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import React, { ReactElement, useState, useEffect } from "react";
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
  const [ia, setIa] = useState<number>(amount[value].increaseAmount);
  const [ca, setCa] = useState<number>(amount[value].currentAmount);
  useEffect(() => {
    setAmount({
      ...amount,
      [value]: { increaseAmount: ia, currentAmount: ca },
    });
  }, [ia, ca]);
  return (
    <HStack spacing="4">
      <Token faceValue={value} width="5rem" />
      <VStack alignItems="flex-start" justifyContent="center">
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
              (${+(ia * (parseInt(value) / 100)).toFixed(2)})
            </Text>
          </Fade>
        </HStack>
        <HStack spacing="0.5rem">
          <Slider
            value={ia}
            onChange={(value) => setIa(value)}
            min={0}
            max={100}
            mr="2"
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize="20px" />
          </Slider>
          <NumberInput
            min={0}
            max={100}
            value={ia}
            onChange={(vs, va) => setIa(va)}
            size="sm"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </VStack>
    </HStack>
  );
}
