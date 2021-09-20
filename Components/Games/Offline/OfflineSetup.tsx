import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Tooltip } from "@chakra-ui/react";
import { ScaleFade } from "@chakra-ui/transition";
import React, { ReactElement, useState } from "react";
import { offlineOptions } from "../../../interfaces/app";
import Hero from "../../Helpers/Hero";

interface Props {
  setContinue: React.Dispatch<React.SetStateAction<boolean>>;
  setSettings: React.Dispatch<React.SetStateAction<offlineOptions>>;
}

export default function OfflineSetup({
  setContinue,
  setSettings,
}: Props): ReactElement {
  const [betAmountShow, setBetAmountShow] = useState(false);
  const [alwaysBetShow, setAlwaysBetShow] = useState(false);
  const [sims, setSims] = useState<number>();
  const [bet, setBet] = useState<number>();
  const [alwaysBet, setAlwaysBet] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSettings({ simulations: sims, betAmount: bet, alwaysBet });
    setContinue(true);
    setLoading(false);
  };
  return (
    <Hero>
      <Heading fontSize="4xl">Settings</Heading>
      <Text fontSize="xs" fontWeight="normal" as="i" pt="2" display="block">
        Please complete these before continuing
      </Text>
      <Box mt="4">
        <form>
          <FormControl>
            <FormLabel>Simulations to run</FormLabel>
            <NumberInput
              value={sims}
              min={1}
              max={1000000}
              step={10}
              keepWithinRange={true}
              isRequired
              onChange={(vs, vn) => {
                setBetAmountShow(true);
                setSims(vn);
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <ScaleFade
            in={betAmountShow}
            initialScale={0.7}
            hidden={!betAmountShow}
          >
            <FormControl mt="4">
              <FormLabel>Amount to bet each run</FormLabel>
              <NumberInput
                value={bet}
                defaultValue={""}
                min={1}
                max={1000}
                onChange={(vs, vn) => {
                  setAlwaysBetShow(true);
                  setBet(vn);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ScaleFade>
          <ScaleFade
            in={alwaysBetShow}
            initialScale={0.7}
            hidden={!alwaysBetShow}
          >
            <FormControl mt="4">
              <HStack spacing="0" alignItems="baseline">
                <Tooltip
                  label="Only bet if your initial hand is favourable"
                  hasArrow
                >
                  <FormLabel>Bet each time?</FormLabel>
                </Tooltip>
                <Checkbox
                  defaultChecked
                  onChange={() => setAlwaysBet(!alwaysBet)}
                />
              </HStack>
            </FormControl>
          </ScaleFade>
          <Flex justifyContent="flex-end" mt="4">
            <Button
              colorScheme="blue"
              isLoading={loading}
              loadingText="Submitting..."
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Hero>
  );
}
