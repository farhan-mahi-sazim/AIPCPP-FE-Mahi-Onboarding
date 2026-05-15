import { Badge } from "@mantine/core";

import { ICustomBadgeProps } from "./CustomBadge.interfaces";
import { useBadgeStyles } from "./CustomBadge.styles";

const CustomBadge: React.FC<ICustomBadgeProps> = ({ capitalize, ...rest }) => {
  const { classes } = useBadgeStyles({ capitalize, ...rest })();

  return <Badge className={classes.customBadge} {...rest} />;
};

export default CustomBadge;
