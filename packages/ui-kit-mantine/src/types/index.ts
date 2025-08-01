import type { IconName } from "../components/Icons/Icon";

export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: IconName;
  onClick?: () => void;
}

// Export other shared types here
export * from "./mantine.d";
