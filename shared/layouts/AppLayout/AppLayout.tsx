import React, { PropsWithChildren, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { AppShell, Box, Burger, Flex, Header, Progress, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import RentReceiptsBanner from "@/shared/components/RentReceiptsBanner/RentReceiptsBanner";
import { ADDITIONAL_ROUTES } from "@/shared/constants/route.constants";

import { useAppLayoutStyles } from "./AppLayout.styles";
import SideBar from "./components/SideBar";
import { NAV_LINKS } from "./components/SideBar/SideBar.constants";

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

  const getCurrentPageName = () => {
    const currentLink =
      NAV_LINKS.find(({ href }) => router.pathname.includes(href)) ||
      ADDITIONAL_ROUTES.find(({ href }) => router.pathname.includes(href));
    return currentLink ? currentLink.label : "Unknown Page";
  };

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
              <Header height={60} p="xs">
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
                      {getCurrentPageName()}
                    </Title>
                  </Flex>
                </div>
              </Header>
            </>
          ),
        })}
      >
        <RentReceiptsBanner />
        {children}
      </AppShell>
    </Box>
  );
};

export default AppLayout;
