import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Heading } from "@chakra-ui/layout";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";

interface Props {
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  isOpen: boolean;
  onClose: () => void;
  betAmount: number;
}

export default function BetAmount({
  setBetAmount,
  isOpen,
  onClose,
  betAmount,
}: Props): ReactElement {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bet Amount</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Enter how much you want to bet</FormLabel>
            <NumberInput
              min={1}
              max={1000}
              onChange={(str, num) => {
                setBetAmount(num);
              }}
              value={betAmount}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
