import { useRouter } from "next/router";

import { Center, Title, Text, Stack, Button } from "@mantine/core";

const NotFound = () => {
  const router = useRouter();

  return (
    <Center h="100vh">
      <Stack align="center">
        <Title order={1}>404 - Page Not Found</Title>
        <Text>The page you are looking for does not exist.</Text>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </Stack>
    </Center>
  );
};

export default NotFound;
