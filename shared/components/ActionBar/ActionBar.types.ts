import { SelectItem } from "@mantine/core";

type TDropDownValues = SelectItem;

export interface IActionBarProps {
  dropdownValues?: TDropDownValues[];
  dropdownTitle?: string;
  dropdownOnChange?: (value: string) => void;
  buttonTitle?: string;
  buttonOnClick?: () => void;
}
