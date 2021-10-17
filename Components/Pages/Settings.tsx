import React, { ReactElement, useState, useEffect } from "react";
import Hero from "../Helpers/Hero";
import { auth } from "../../utils/firebase/firebase-config";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/button";
import { Flex, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { useAuth } from "../../utils/hooks";
import FullPageLoading from "../Helpers/FullPageLoading";
import { updateBalance } from "../../utils/firebase/firestore";

export default function Settings(): ReactElement {
  const router = useRouter();
  const [signoutLoading, setLoading] = useState(false);
  const [ten, setTen] = useState(false);
  const [hundred, setHundred] = useState(false);
  const [thousand, setThousand] = useState(false);
  const { loading, user } = useAuth();
  //Store a local copy of our balance, so we don't have to keep updating it
  const [bal, setBal] = useState(0);
  const handleSignOut = async () => {
    setLoading(true);
    await signOut(auth);
    router.push("/signin");
  };
  useEffect(() => {
    if (user) {
      setBal(user.balance);
    }
  }, [user]);
  if (loading) {
    return <FullPageLoading />;
  }
  return (
    <Hero>
      <Heading>Settings</Heading>
      <VStack alignItems="flex-start" mt="3">
        <HStack justifyContent="flex-start">
          <Heading fontSize="lg">Bank Balance:</Heading>
          <Text fontSize="lg">${bal}</Text>
          <Button
            variant="outline"
            size="sm"
            isLoading={ten}
            onClick={async () => {
              setTen(true);
              await updateBalance(user.userID, bal + 10);
              setBal(bal + 10);
              setTen(false);
            }}
          >
            +10
          </Button>
          <Button
            variant="outline"
            size="sm"
            isLoading={hundred}
            onClick={async () => {
              setHundred(true);
              await updateBalance(user.userID, bal + 100);
              setBal(bal + 100);
              setHundred(false);
            }}
          >
            +100
          </Button>
          <Button
            variant="outline"
            size="sm"
            isLoading={thousand}
            onClick={async () => {
              setThousand(true);
              await updateBalance(user.userID, bal + 1000);
              setBal(bal + 1000);
              setThousand(false);
            }}
          >
            +1000
          </Button>
        </HStack>
      </VStack>
      <Flex w="full" justifyContent="flex-end">
        <Button
          onClick={handleSignOut}
          colorScheme="red"
          loadingText="Signing out..."
          mr="2"
          isLoading={signoutLoading}
        >
          Sign Out
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            router.push("/");
          }}
        >
          Go Home
        </Button>
      </Flex>
    </Hero>
  );
}
