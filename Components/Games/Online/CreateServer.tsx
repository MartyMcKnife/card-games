import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import React, { ReactElement, useState } from "react";
import { ServerConf, Games, User } from "../../../interfaces/app";
import BoxItem from "../../BoxItem";
import { onlineOptions } from "../../../interfaces/app";
import { createServer } from "../../../utils/firebase/firestore";
import shortid from "shortid";

interface Props {
  setOptions: React.Dispatch<React.SetStateAction<string>>;
  setContinue: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  gameType: Games;
}

export default function CreateServer({
  setOptions,
  setContinue,
  user,
  gameType,
}: Props): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [maxPlayers, setMaxPlayers] = useState<number>(6);
  const [maxBet, setMaxBet] = useState(20);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const gameID = Math.random().toString(36).substr(2, 6);
    if (gameType && maxPlayers && maxBet) {
      try {
        await createServer(
          {
            gameID,
            gameType,
            maxPlayers,
            currentPlayers: 0,
            maxBet,
          },
          user
        );
      } catch (error) {
        console.error(error);
        setError("Unexpected error when creating server!");
        setLoading(false);
        return;
      }
    } else {
      console.log(gameType, maxPlayers, maxBet);
      setError("Please fill in all fields!");
      setLoading(false);
      return;
    }

    setOptions(gameID);
    onClose();
    setContinue(true);
  };
  return (
    <>
      <BoxItem
        name="Create a server"
        description="Create a server for your friends!"
        icon="/imgs/create-server.png"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="3xl">Enter Server Options</ModalHeader>
          <ModalBody>
            <FormControl mt="4">
              <FormLabel>Max Players</FormLabel>
              <NumberInput
                min={2}
                max={gameType === "twoup" ? 3 : 10}
                onChange={(str, num) => {
                  setMaxPlayers(num);
                }}
                value={maxPlayers}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Max Bet</FormLabel>
              <NumberInput
                min={1}
                max={1000}
                onChange={(str, num) => {
                  setMaxBet(num);
                }}
                value={maxBet}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            {error && (
              <Text textColor="red.600" fontSize="sm" mt="2">
                {error}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleSubmit();
              }}
              loadingText="Loading"
              isLoading={loading}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
