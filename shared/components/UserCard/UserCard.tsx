import { useRouter } from "next/router";
import React from "react";
import { MdLogout } from "react-icons/md";
import { RxAvatar, RxGear } from "react-icons/rx";

import { ActionIcon, Box, Flex, Paper, Text } from "@mantine/core";

import { useSignOut } from "@/shared/hooks/useSignOut";

import { useSessionContext } from "../wrappers/AppInitializer/AppInitializerContext";

const UserCard = () => {
  const router = useRouter();
  const { isLoading, user } = useSessionContext();
  const { signOut } = useSignOut();

  return !isLoading && user ? (
    <Paper bg="gray.1" p="xs" radius="lg">
      <Flex align="center" gap="xs">
        <RxAvatar size={40} color="blue.9" />
        <Box w="55%">
          <Text size="lg" truncate>
            {user.userFirstName + " " + user.userLastName}
          </Text>
        </Box>
        <Flex>
          <ActionIcon
            color="green.8"
            radius="md"
            onClick={() => router.push("/user-profile")}
          >
            <RxGear size={20} />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => signOut()}
            radius="md"
            ml="auto"
            my="auto"
          >
            <MdLogout size={20} />
          </ActionIcon>
        </Flex>
      </Flex>
    </Paper>
  ) : null;
};

export default UserCard;
