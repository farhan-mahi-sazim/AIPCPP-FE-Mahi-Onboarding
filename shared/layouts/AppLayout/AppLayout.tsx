import { PropsWithChildren, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { AppShell, Box, Burger, Flex, Progress, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { getCurrentPageName } from "./AppLayout.helpers";
import { useAppLayoutStyles } from "./AppLayout.styles";
import SideBar from "./components/SideBar";

const AppLayout = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { classes } = useAppLayoutStyles(isLoading);
  const router = useRouter();
  const isPotrait = useMediaQuery("(orientation: portrait)");

  useEffect(() => {
    router.events.on("routeChangeStart", () => setIsLoading(true));
    router.events.on("routeChangeComplete", () => setIsLoading(false));
    router.events.on("routeChangeError", () => setIsLoading(false));
    router.events.on("beforeHistoryChange", () => setIsLoading(false));

    return () => {
      router.events.off("routeChangeStart", () => setIsLoading(true));
      router.events.off("routeChangeComplete", () => setIsLoading(false));
      router.events.off("routeChangeError", () => setIsLoading(false));
      router.events.off("beforeHistoryChange", () => setIsLoading(false));
    };
  }, [router.events]);

  return (
    <Box pos="relative">
      {isLoading && (
        <Progress
          color="green.8"
          size="lg"
          radius="xs"
          value={100}
          striped
          animate
          pos="absolute"
          top={0}
          w="100%"
          className={classes.linearProgress}
        />
      )}

      <AppShell
        className={classes.appShell}
        opacity={isLoading ? 0.4 : 1.0}
        navbarOffsetBreakpoint="md"
        navbar={<SideBar isOpen={isOpen} setIsOpen={setIsOpen} />}
        {...(isPotrait && {
          header: (
            <>
              <header className="h-[60px] p-2">
                <div className={classes.header}>
                  <div className={classes.burgerMenu}>
                    <Burger
                      opened={isOpen}
                      onClick={() => setIsOpen((o) => !o)}
                      size="sm"
                      mr="xl"
                    />
                  </div>
                  <Flex justify="center" align="center">
                    <Title order={3} fw="lighter">
                      {getCurrentPageName(router.pathname)}
                    </Title>
                  </Flex>
                </div>
              </header>
            </>
          ),
        })}
      >
        {children}
      </AppShell>
    </Box>
  );
};

export default AppLayout;
