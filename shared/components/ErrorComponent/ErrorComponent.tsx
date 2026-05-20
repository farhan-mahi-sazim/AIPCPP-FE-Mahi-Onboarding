import React from "react";

import { Box, Flex, Title } from "@mantine/core";

import { parseApiErrorMessage } from "@/shared/utils/errors";

import BackButton from "../BackButton";
import { IErrorComponentProps } from "./ErrorComponent.types";

const ErrorComponent: React.FC<IErrorComponentProps> = ({ error }) => {
  const defaultErrorMessage = "Something went wrong. Please try again later";
  const errorMessage = parseApiErrorMessage(error);
  return (
    <Box mt="2rem" ml="2rem">
      <BackButton />
      <Flex h="75vh" w="100%" align="center" justify="center" direction="column">
        <Title align="center" color="dimmed" fw="bold">
          {errorMessage ?? defaultErrorMessage}
        </Title>
      </Flex>
    </Box>
  );
};

export default ErrorComponent;
