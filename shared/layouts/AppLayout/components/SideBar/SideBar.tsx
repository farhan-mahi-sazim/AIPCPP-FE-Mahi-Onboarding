import React, { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { Navbar as Sidebar, Button, Flex, Divider } from "@mantine/core";

import UserCard from "@/shared/components/UserCard";
import { APP_NAME } from "@/shared/constants/app.constants";

import { NAV_LINKS } from "./SideBar.constants";
import { useSideBarStyles } from "./SideBar.styles";
import { ISideBarProps } from "./SideBar.types";

const SideBar: React.FC<ISideBarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { classes } = useSideBarStyles();

  useEffect(() => {
    if (!isOpen) return;

    const handleRouteChange = () => {
      setIsOpen(false);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [isOpen, router.events, setIsOpen]);

  const getClassName = (href: string) =>
    router.pathname.includes(href) ? classes.activeButton : classes.inactiveButton;

  return (
    <Sidebar p="md" hidden={!isOpen} width={{ sm: 250, lg: 300 }}>
      <Sidebar.Section mt="md">
        <Flex justify="center">
          <Image src="/logo.svg" width={200} height={30} alt={APP_NAME} />
        </Flex>
      </Sidebar.Section>
      <Divider mt="md" color="gray.3" />
      <Sidebar.Section grow mt="md" p="xs">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => (
          <Button
            key={label}
            onClick={() => {
              router.push(href);
            }}
            fullWidth
            className={getClassName(href)}
          >
            <div className={classes.icon}>{Icon}</div>
            {label}
          </Button>
        ))}
      </Sidebar.Section>
      <Sidebar.Section p="xs">
        <UserCard />
      </Sidebar.Section>
    </Sidebar>
  );
};

export default SideBar;
