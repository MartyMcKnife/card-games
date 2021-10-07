import { Heading, SimpleGrid } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React, { ReactElement } from "react";
import { onlineOptions } from "../../../interfaces/app";
import { randomServerID } from "../../../utils/firebase/firestore";
import { useAuth } from "../../../utils/hooks";
import BoxItem from "../../BoxItem";
import FullPageLoading from "../../Helpers/FullPageLoading";
import Hero from "../../Helpers/Hero";
import CreateServer from "./CreateServer";
import GameCode from "./GameCode";

interface Props {
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setContinue: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OnlineSetup({
  setCode,
  setContinue,
}: Props): ReactElement {
  const toast = useToast();
  const { loading, user } = useAuth();
  if (loading) {
    return <FullPageLoading />;
  } else {
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
                  setCode(gameID);
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
          <CreateServer
            setOptions={setCode}
            setContinue={setContinue}
            user={user}
          />
          <GameCode setOptions={setCode} setContinue={setContinue} />
        </SimpleGrid>
      </Hero>
    );
  }
}
