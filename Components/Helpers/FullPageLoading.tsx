import React, { ReactElement } from "react";
import { Center, Heading } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import { HStack } from "@chakra-ui/react";
import { useLoadingText } from "../../utils/hooks";

export default function FullPageLoading(): ReactElement {
  const text = useLoadingText();
  return (
    <Center h="100vh" backgroundColor="gray.50">
      <HStack spacing="4" alignItems="stretch">
        <CircularProgress isIndeterminate thickness="6px" size="12" />
        <Heading>{text}</Heading>
      </HStack>
    </Center>
  );
}
