import { createStyles } from "@/shared/utils/createStyles";

export const useNotesListStyles = createStyles((theme) => ({
  note: {
    margin: "0.5em 0em",
    padding: "0",
    backgroundColor: theme.colors.blue[1],
    border: `0.1em solid ${theme.colors.blue[3]}`,
  },

  timeStamp: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    color: theme.colors.dark[4],
    fontSize: "0.8rem",
  },
}));
