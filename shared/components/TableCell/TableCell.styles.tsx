import { createStyles } from "@mantine/core";

export const useTableCellStyles = createStyles(() => ({
  cell: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: `calc(100vw/6)`,
  },
}));
