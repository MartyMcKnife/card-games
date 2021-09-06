import React, { ReactElement } from "react";
import { Box, Image, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "react-router-dom";

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
      <Tooltip label={description} aria-label="A tooltip">
        <Link to={linkurl}>
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
        </Link>
      </Tooltip>
    </Box>
  );
}
