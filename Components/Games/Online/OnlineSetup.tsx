import { Heading, SimpleGrid } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React, { ReactElement } from "react";
import { onlineOptions } from "../../../interfaces/app";
import { randomServerID } from "../../../utils/firebase/firestore";
import BoxItem from "../../BoxItem";
import Hero from "../../Helpers/Hero";
import CreateServer from "./CreateServer";
import GameCode from "./GameCode";

interface Props {
  setOptions: React.Dispatch<React.SetStateAction<onlineOptions>>;
  setContinue: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OnlineSetup({
  setOptions,
  setContinue,
}: Props): ReactElement {
  const toast = useToast();
  return (
    <Hero>
      <Heading>Multiplayer</Heading>
      <SimpleGrid columns={[2, 3]} mt="4" w="full" gap="4">
        <BoxItem
          name="Join a server"
          description="Join the first available server"
          icon="/imgs/servers.png"
          onClick={async () => {
            try {
              const gameID = await randomServerID();
              if (gameID) {
                setContinue(true);
                setOptions({ random: true });
              } else {
                toast({
                  title: "No servers found!",
                  description: "Try making one",
                  duration: 4000,
                  isClosable: true,
                  status: "error",
                  position: "bottom-right",
                });
              }
            } catch (err) {
              console.error(err);
              toast({
                title: "Unexpected error occurred!",
                description: "Please try again later",
                duration: 4000,
                isClosable: true,
                status: "error",
                position: "bottom-right",
              });
            }
          }}
        />
        <CreateServer setOptions={setOptions} setContinue={setContinue} />
        <GameCode setOptions={setOptions} setContinue={setContinue} />
      </SimpleGrid>
    </Hero>
  );
}
