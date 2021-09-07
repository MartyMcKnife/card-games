import React, { ReactElement } from "react";
import { Flex, Divider, Text } from "@chakra-ui/react";

interface Props {
  children?: React.ReactNode;
}

export default function DividerWithText({ children }: Props): ReactElement {
  return (
    <Flex width="full" justifyContent="center" alignItems="center">
      <Divider borderBottomWidth="2px" />
      <Text marginX="2">{children}</Text>
      <Divider borderBottomWidth="2px" />
    </Flex>
  );
}
