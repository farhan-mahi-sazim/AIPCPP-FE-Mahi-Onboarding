import { STAGE_ENV } from "../env.constants";
import { FLAGS } from "./featureFlags";

export function isFlagEnabled(flagName: string): boolean {
  const environmentFlags = FLAGS[STAGE_ENV];
  return environmentFlags ? !!environmentFlags[flagName as keyof typeof environmentFlags] : false;
}
