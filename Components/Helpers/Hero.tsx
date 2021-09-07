import React, { ReactElement } from "react";
import { Box, Flex } from "@chakra-ui/react";

interface Props {
  children?: React.ReactNode;
}

export default function Hero({ children }: Props): ReactElement {
  return (
    <Box bgColor="gray.50" height="screen-h" width="auto">
      <Flex justify="center" alignItems="center" height="full">
        <Box shadow="lg" alignItems="center" padding="8" rounded="lg">
          {children}
        </Box>
      </Flex>
    </Box>
  );
}
