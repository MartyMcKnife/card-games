import React, { ReactElement } from "react";
import { Box, Image, Text, Tooltip } from "@chakra-ui/react";

interface Props {
  name: string;
  icon: string;
  description: string;
  linkurl: string;
}

export default function BoxItem({
  name,
  icon,
  description,
  linkurl,
}: Props): ReactElement {
  return (
    <Box cursor="pointer" width="max-content" textAlign="center">
      <a href={linkurl}>
        <Tooltip label={description} aria-label="A tooltip">
          <span tabIndex={0}>
            <Image
              src={icon}
              width="24"
              maxHeight="16"
              marginX="auto"
              objectFit="cover"
              rounded="lg"
            />
            <Text fontWeight="bold" paddingTop="2">
              {name}
            </Text>{" "}
          </span>
        </Tooltip>
      </a>
    </Box>
  );
}
