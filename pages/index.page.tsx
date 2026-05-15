import { Center, Title, Text, Stack, Container } from "@mantine/core";

export default function HomePage() {
  return (
    <Container size="md">
      <Center h="100vh">
        <Stack align="center">
          <Title order={1}>Next.js Starter Template</Title>
          <Text size="lg" c="dimmed">
            Refactored and updated for your new project.
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
