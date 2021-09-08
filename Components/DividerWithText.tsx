import React, { ReactElement } from "react";
import { Flex, Divider, Text } from "@chakra-ui/react";

interface Props {
  children?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

export default function DividerWithText({
  children,
  orientation = "horizontal",
}: Props): ReactElement {
  return (
    <Flex
      width="full"
      justifyContent="center"
      alignItems="center"
      flexDirection={orientation === "horizontal" ? "row" : "column"}
    >
      <Divider borderBottomWidth="2px" orientation={orientation} />
      <Text marginX="2">{children}</Text>
      <Divider borderBottomWidth="2px" orientation={orientation} />
    </Flex>
  );
}
