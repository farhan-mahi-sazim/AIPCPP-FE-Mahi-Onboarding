import { createStyles } from "@mantine/core";

export const useNotesFormStyles = createStyles((theme) => ({
  button: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: theme.colors.dark[4],

    "&:hover": {
      background: "none",
    },
  },
}));
