import { createStyles } from "@mantine/core";

export const useNoDataStyles = createStyles((theme) => ({
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontSize: "1.5rem",
    color: theme.colors.gray[5],
    textAlign: "center",
  },
}));
