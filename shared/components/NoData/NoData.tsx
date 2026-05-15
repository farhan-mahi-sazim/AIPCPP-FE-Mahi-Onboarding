import { Container, Text } from "@mantine/core";

import { useNoDataStyles } from "./NoData.styles";
import { TNoDataProps } from "./NoData.types";

const NoData: React.FC<TNoDataProps> = ({
  description = "No Data",
  textSize = "xl",
  component = "div",
}) => {
  const { classes } = useNoDataStyles();
  return (
    <Container className={classes.noData}>
      <Text size={textSize} component={component}>
        {description}
      </Text>
    </Container>
  );
};

export default NoData;
