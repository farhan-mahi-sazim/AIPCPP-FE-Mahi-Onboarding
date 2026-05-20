import React from "react";

import { LoadingOverlay } from "@mantine/core";

const LoadingComponent = ({ visible }: { visible: boolean }) => (
  <LoadingOverlay visible={visible} loaderProps={{ size: "xl", color: "green" }} />
);

export default LoadingComponent;
