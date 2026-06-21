import { createStyles } from "@/shared/utils/createStyles";

import { BUTTON_STYLE } from "./SideBar.constants";

export const useSideBarStyles = createStyles((theme) => ({
  icon: {
    marginRight: 10,
    paddingRight: 10,
    fontSize: "1.5em",
  },

  activeButton: {
    ...BUTTON_STYLE,
    backgroundColor: theme.colors.green[9],

    "&:hover": {
      backgroundColor: theme.colors.green[9],
    },
  },

  inactiveButton: {
    ...BUTTON_STYLE,
    color: theme.colors.gray[4],

    backgroundColor: theme.colors.gray[1],

    "&:hover": {
      backgroundColor: theme.colors.green[1],
    },
  },
}));
