import { createStyles } from "@/shared/utils/createStyles";

export const useTableCellStyles = createStyles(() => ({
  cell: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: `calc(100vw/6)`,
  },
}));
