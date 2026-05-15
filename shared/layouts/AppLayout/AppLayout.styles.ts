import { createStyles } from "@mantine/core";

export const useAppLayoutStyles = (isLoading: boolean) =>
  createStyles((theme) => ({
    linearProgress: {
      zIndex: 999,
      color: theme.colors.green[9],
    },

    appShell: {
      pointerEvents: isLoading ? "none" : "auto",
      backgroundColor: theme.colors.green[0],
    },

    header: {
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },

    burgerMenu: {
      position: "absolute",
      left: 0,
    },
  }))();
