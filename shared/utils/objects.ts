import { ComboboxItem } from "@mantine/core";

import type { TRecursiveKeyOf } from "../typedefs/RecursiveKeyOf.types";

export function convertDataToMantineSelectData<
  T extends Record<string, unknown>,
  L extends TRecursiveKeyOf<T>,
>(
  inputData: T[],
  attributeAsLabel: L,
  attributeAsValue: TRecursiveKeyOf<T>,
  formatLabel?: (label: T[L]) => string,
): ComboboxItem[] {
  const convertedData: ComboboxItem[] = [];
  inputData.forEach((data) => {
    const label = getNestedObjectValue(data, attributeAsLabel as string);
    const formattedLabel = formatLabel
      ? formatLabel(label as T[L])
      : String(label);
    const value = getNestedObjectValue(data, attributeAsValue as string);
    const formattedValue = String(value);
    convertedData.push({ label: formattedLabel, value: formattedValue });
  });
  return convertedData;
}

export function getNestedObjectValue<T extends Record<string, unknown>>(
  obj: T,
  path: string,
): unknown {
  const keys = path.split(".");

  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    }
  }

  return value;
}
