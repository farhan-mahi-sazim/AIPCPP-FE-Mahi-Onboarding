import React from "react";

import { Flex, Box, Title } from "@mantine/core";

import BackButton from "../BackButton";

const Unauthorized = () => (
  <Box mt="2rem" ml="2rem">
    <BackButton />
    <Flex h="75vh" w="100%" align="center" justify="center" direction="column">
      <Title align="center">Unauthorized</Title>
      <Title order={3} align="center" color="dimmed" mt={16}>
        That&lsquo;s all we know
      </Title>
    </Flex>
  </Box>
);

export default Unauthorized;
