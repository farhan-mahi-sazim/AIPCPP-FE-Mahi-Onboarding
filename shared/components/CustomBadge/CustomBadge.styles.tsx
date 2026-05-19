import { createStyles } from "@/shared/utils/createStyles";

import { ICustomBadgeProps } from "./CustomBadge.interfaces";

export const useBadgeStyles = (props: ICustomBadgeProps) =>
  createStyles(() => ({
    customBadge: props.capitalize ? {} : { textTransform: "none" },
  }));
