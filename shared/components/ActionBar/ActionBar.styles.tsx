import { createStyles } from "@mantine/core";

export const useActionBarStyles = createStyles((theme) => ({
  menuButton: {
    background: "none",
    backgroundColor: theme.colors.green[8],
    fontSize: "1em",
    fontWeight: 400,
    borderRadius: 10,

    "&:hover": {
      backgroundColor: theme.colors.green[7],
    },
  },

  button: {
    background: "none",
    color:
      theme.colors && theme.colors["primary"] && theme.colors["primary"][1]
        ? theme.colors["primary"][1]
        : theme.white,

    fontSize: 18,
    fontWeight: 400,
    backgroundColor:
      theme.colors && theme.colors["secondary"] && theme.colors["secondary"][0]
        ? theme.colors["secondary"][0]
        : theme.white,

    "&:hover": {
      backgroundColor:
        theme.colors &&
        theme.colors["secondary"] &&
        theme.colors["secondary"][0]
          ? theme.colors["secondary"][0]
          : theme.white,
    },
    "&:active": {
      backgroundColor:
        theme.colors &&
        theme.colors["secondary"] &&
        theme.colors["secondary"][0]
          ? theme.colors["secondary"][0]
          : theme.white,
    },
  },

  menuDropdown: {
    minWidth: "9em",
  },
}));
