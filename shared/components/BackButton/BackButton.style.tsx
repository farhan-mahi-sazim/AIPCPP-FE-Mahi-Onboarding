import { createStyles } from "@mantine/core";

export const useBackButtonStyles = createStyles((theme) => ({
  backButton: {
    background: "none",
    color: theme.colors.gray[7],
    backgroundColor: theme.colors.gray[0],
    padding: "0.5em 1em 0.5em 0.5em",
    borderRadius: 100,

    "&:hover": {
      backgroundColor: theme.colors.green[6],
    },

    "&:active": {
      backgroundColor: theme.colors.green[9],
    },
  },
}));
