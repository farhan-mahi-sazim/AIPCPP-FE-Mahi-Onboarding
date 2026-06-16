import React, { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { Button, Flex, Divider } from "@mantine/core";

import UserCard from "@/shared/components/UserCard";
import { APP_NAME } from "@/shared/constants/app.constants";

import { NAV_LINKS } from "./SideBar.constants";
import { getClassName } from "./SideBar.helpers";
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

  return (
    <aside className={`p-4 ${isOpen ? "" : "hidden"} w-full sm:w-[250px] lg:w-[300px]`}>
      <div className="mt-4">
        <Flex justify="center">
          <Image src="/logo.svg" width={200} height={30} alt={APP_NAME} />
        </Flex>
      </div>
      <Divider mt="md" color="gray.3" />
      <div className="grow mt-4 px-2">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => (
          <Button
            key={label}
            onClick={() => {
              router.push(href);
            }}
            fullWidth
            className={getClassName(router.pathname, href, classes)}
          >
            <div className={classes.icon}>{Icon}</div>
            {label}
          </Button>
        ))}
      </div>
      <div className="px-2">
        <UserCard />
      </div>
    </aside>
  );
};

export default SideBar;
