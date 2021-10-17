import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/modal";
import { useRouter } from "next/router";
import React, { ReactElement, useRef, useState } from "react";
import { Balance } from "../../interfaces/app";
import { updateBalance } from "../../utils/firebase/firestore";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<Boolean>>;
  total: number;
  newBalance: Balance;
  userID: string;
}

export default function ConfirmPayment({
  open,
  setOpen,
  total,
  userID,
  newBalance,
}: Props): ReactElement {
  const cancelRef = useRef();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    setLoading(true);
    await updateBalance(userID, 500); //newBalance);
    setLoading(false);
    setOpen(false);
    router.push("/");
  };
  return (
    <AlertDialog
      isOpen={open}
      leastDestructiveRef={cancelRef}
      onClose={() => setOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Pay ${total}?
          </AlertDialogHeader>
          <AlertDialogBody>Please enter your card info below:</AlertDialogBody>
          <Flex justifyContent="space-between" px="6">
            <Input placeholder="Card Number" size="md" mr="2" />
            <Input placeholder="Expire Date" size="md" mr="2" />
            <Input placeholder="CVC" size="md" />
          </Flex>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleClick}
              ml="3"
              isLoading={loading}
              loadingText="Confirming payment..."
            >
              Pay ${total}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
