import React, { ReactElement } from "react";
import { Box, Image, Text, Tooltip } from "@chakra-ui/react";

interface Props {
  name: string;
  icon: string;
  description: string;
  linkurl?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function BoxItem({
  name,
  icon,
  description,
  linkurl,
  onClick,
}: Props): ReactElement {
  return (
    <Box
      cursor="pointer"
      width="max-content"
      textAlign="center"
      onClick={onClick}
    >
      <a href={linkurl}>
        <Tooltip label={description} aria-label="A tooltip">
          <span tabIndex={0}>
            <Image
              src={icon}
              w="24"
              height="auto"
              marginX="auto"
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
