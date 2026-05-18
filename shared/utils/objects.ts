import { SelectItem } from "@mantine/core";

import { RecursiveKeyOf } from "../typedefs/RecursiveKeyOf.types";

export function convertDataToMantineSelectData<
  T extends Record<string, unknown>,
  L extends RecursiveKeyOf<T>,
>(
  inputData: T[],
  attributeAsLabel: L,
  attributeAsValue: RecursiveKeyOf<T>,
  formatLabel?: (label: T[L]) => string,
): SelectItem[] {
  const convertedData: SelectItem[] = [];
  inputData.forEach((data) => {
    const label = getNestedObjectValue(data, attributeAsLabel as string);
    const formattedLabel = formatLabel
      ? formatLabel(label as T[L])
      : label?.toString() || String(label);
    const value = getNestedObjectValue(data, attributeAsValue as string);
    const formattedValue = value?.toString() || String(value);
    convertedData.push({ label: formattedLabel, value: formattedValue });
  });
  return convertedData;
}

export function getNestedObjectValue<T extends Record<string, unknown>, U extends keyof T>(
  obj: T,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): U extends keyof T ? T[U] : any {
  const keys = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    }
  }

  return value;
}
