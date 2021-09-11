import { Box, Heading, SimpleGrid } from "@chakra-ui/layout";
import React, { ReactElement, useState, useEffect } from "react";
import FullPageLoading from "../Components/Helpers/FullPageLoading";
import Hero from "../Components/Helpers/Hero";
import PurchaseToken from "../Components/Tokens/PurchaseToken";
import Token from "../Components/Tokens/Token";
import { MoreMoney } from "../interfaces/app";
import { useAuth } from "../utils/hooks";

interface Props {}

export default function Tokens({}: Props): ReactElement {
  const { loading, user } = useAuth();
  const [amount, setAmount] = useState<MoreMoney>({});
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
  if (!loading) {
    return (
      <Hero>
        {console.log(amount)}

        <Heading>Tokens</Heading>
        <Box paddingX="2">
          <Heading size="md" marginTop="4">
            Current Balance:
          </Heading>
          <SimpleGrid columns={[2, 4]}>
            {amount[1000] && (
              <PurchaseToken value="1" setAmount={setAmount} amount={amount} />
            )}
          </SimpleGrid>
        </Box>
      </Hero>
    );
  } else {
    return <FullPageLoading />;
  }
}
