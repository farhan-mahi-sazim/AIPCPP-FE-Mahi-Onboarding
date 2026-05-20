import React from "react";

import { Menu, Button, Flex } from "@mantine/core";
import { CiCirclePlus } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";

import { useIsPortrait } from "@/shared/hooks/useIsPortrait";

import { useActionBarStyles } from "./ActionBar.styles";
import { IActionBarProps } from "./ActionBar.types";

const ActionBar: React.FC<IActionBarProps> = ({
  dropdownValues,
  dropdownTitle = "Menu",
  dropdownOnChange,
  buttonTitle,
  buttonOnClick,
}) => {
  const { classes } = useActionBarStyles();
  const isPortrait = useIsPortrait();

  return (
    <Flex direction={isPortrait ? "column" : "row"} gap="xs" m={0}>
      <Flex align="center" justify="flex-start" gap="lg">
        {dropdownValues && (
          <Menu>
            <Menu.Target>
              <Button className={classes.menuButton}>
                {dropdownTitle} <FaAngleDown />
              </Button>
            </Menu.Target>
            <Menu.Dropdown className={classes.menuDropdown}>
              {dropdownValues?.map(({ label, value }) => (
                <Menu.Item
                  key={value}
                  onClick={
                    dropdownOnChange &&
                    (() => {
                      dropdownOnChange(value);
                    })
                  }
                >
                  {label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
        {buttonTitle && (
          <Button
            className={classes.menuButton}
            rightIcon={<CiCirclePlus size={25} />}
            onClick={buttonOnClick}
          >
            {buttonTitle}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default ActionBar;
