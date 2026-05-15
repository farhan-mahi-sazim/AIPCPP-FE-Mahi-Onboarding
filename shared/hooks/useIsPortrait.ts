import { useMediaQuery } from "@mantine/hooks";

export function useIsPortrait() {
  return useMediaQuery("(orientation: portrait)");
}
