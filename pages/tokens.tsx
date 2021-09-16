import { Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/layout";
import { Button, Fade } from "@chakra-ui/react";
import React, { ReactElement, useState, useEffect } from "react";
import FullPageLoading from "../Components/Helpers/FullPageLoading";
import Hero from "../Components/Helpers/Hero";
import ConfirmPayment from "../Components/Tokens/ConfirmPayment";
import PurchaseToken from "../Components/Tokens/PurchaseToken";
import Token from "../Components/Tokens/Token";
import { Balance, MoreMoney } from "../interfaces/app";
import { useAuth } from "../utils/hooks";

interface Props {}

export default function Tokens({}: Props): ReactElement {
  const { loading, user } = useAuth();
  const [amount, setAmount] = useState<MoreMoney>({});
  const [newBalance, setNewBalance] = useState<Balance>({});
  const [total, setTotal] = useState<number>();
  const [confirmPayment, setConfirmPayment] = useState(false);

  useEffect(() => {
    //Generates user's finances
    if (!loading) {
      let newObj = amount;

      for (const value in user.balance) {
        const currentAmount: number = user.balance[value];
        newObj = { ...newObj, [value]: { increaseAmount: 0, currentAmount } };
      }
      setAmount(newObj);
    }
  }, [loading]);
  useEffect(() => {
    let newTotal = 0;
    let localNewBalance: Balance = newBalance;
    for (const value in amount) {
      const ia: number = amount[value].increaseAmount;
      const ca: number = amount[value].currentAmount;
      localNewBalance = { ...localNewBalance, [value]: ia + ca };
      newTotal += (ia / 100) * parseInt(value);
    }
    setTotal(+newTotal.toFixed(2));
    setNewBalance(localNewBalance);
    console.log(newBalance);
  }, [amount]);

  if (!loading) {
    return (
      <Hero>
        <Heading>Tokens</Heading>
        {amount[1000] && (
          <>
            <SimpleGrid columns={[1, 2, 3, 4]} paddingX="2" mt="6" spacing="6">
              <PurchaseToken value="1" setAmount={setAmount} amount={amount} />
              <PurchaseToken value="5" setAmount={setAmount} amount={amount} />
              <PurchaseToken value="20" setAmount={setAmount} amount={amount} />
              <PurchaseToken value="50" setAmount={setAmount} amount={amount} />
              <PurchaseToken
                value="100"
                setAmount={setAmount}
                amount={amount}
              />
              <PurchaseToken
                value="500"
                setAmount={setAmount}
                amount={amount}
              />
              <PurchaseToken
                value="1000"
                setAmount={setAmount}
                amount={amount}
              />
            </SimpleGrid>
            <Fade in={total > 0}>
              <Flex w="full" justifyContent="flex-end" mt="2">
                <Button
                  colorScheme="blue"
                  onClick={() => setConfirmPayment(true)}
                >
                  Buy for ${total}
                </Button>
              </Flex>
            </Fade>
            {total > 0 && (
              <ConfirmPayment
                open={confirmPayment}
                setOpen={setConfirmPayment}
                total={total}
                newBalance={newBalance}
                userID={user.userID}
              />
            )}
          </>
        )}
      </Hero>
    );
  } else {
    return <FullPageLoading />;
  }
}
