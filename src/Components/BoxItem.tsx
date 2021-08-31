import React, { ReactElement } from "react";
import { Box, Image, Text, Tooltip } from "@chakra-ui/react";

interface Props {
  name: string;
  icon: string;
  description: string;
}

export default function BoxItem({
  name,
  icon,
  description,
}: Props): ReactElement {
  return (
    <Box cursor="pointer" width="max-content" textAlign="center">
      <Tooltip label={description} aria-label="A tooltip">
        <span tabIndex={0}>
          <Image
            src={icon}
            width="24"
            maxHeight="16"
            marginX="auto"
            objectFit="cover"
          />
          <Text fontWeight="bold" paddingTop="2">
            {name}
          </Text>{" "}
        </span>
      </Tooltip>
    </Box>
  );
}
