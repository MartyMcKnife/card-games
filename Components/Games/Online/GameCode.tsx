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
import { Text, Input } from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import BoxItem from "../../BoxItem";
import { onlineOptions } from "../../../interfaces/app";
import {
  connectPlayer,
  getServerGameID,
} from "../../../utils/firebase/firestore";

interface Props {
  setOptions: React.Dispatch<React.SetStateAction<onlineOptions>>;
  setContinue: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateServer({
  setOptions,
  setContinue,
}: Props): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gameCode, setGameCode] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (gameCode) {
      try {
        const code = await getServerGameID(gameCode);
        if (!code) {
          setError("No game for that id exists!");
          setLoading(false);
          return;
        } else {
          connectPlayer(code);
        }
      } catch (error) {
        console.error(error);
        setError("Unexpected error when fetching game!");
        setLoading(false);
        return;
      }
    } else {
      setError("Please provide a code!");
      setLoading(false);
      return;
    }
    setOptions({ random: false, code: gameCode });
    onClose();
    setContinue(true);
  };
  return (
    <>
      <BoxItem
        name="Join a game"
        description="Enter a game code to join your friends!"
        icon="/imgs/abc.png"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Server Options</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Enter the code</FormLabel>
              <Input
                placeholder="AAAAAAA"
                onChange={(txt) => {
                  setGameCode(txt.target.value);
                }}
              />
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
