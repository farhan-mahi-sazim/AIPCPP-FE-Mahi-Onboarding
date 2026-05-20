import { createStyles } from "@/shared/utils/createStyles";

const button = {
  display: "flex",
  fontSize: "1em",
  fontWeight: 400,
  height: "3.2em",
  borderRadius: "0.7em",
  marginBottom: "0.7em",
};

export const useSideBarStyles = createStyles((theme) => ({
  icon: {
    marginRight: 10,
    paddingRight: 10,
    fontSize: "1.5em",
  },

  activeButton: {
    ...button,
    backgroundColor: theme.colors.green[9],

    "&:hover": {
      backgroundColor: theme.colors.green[9],
    },
  },

  inactiveButton: {
    ...button,
    color: theme.colors.gray[4],

    backgroundColor: theme.colors.gray[1],

    "&:hover": {
      backgroundColor: theme.colors.green[1],
    },
  },
}));
