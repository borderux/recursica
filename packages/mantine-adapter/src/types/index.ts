import { IconName } from "../components/Icons/Icon";

export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: IconName; // Use string for now, can be IconName later
  onClick?: () => void;
}

// Export other shared types here
// export * from "./mantine.d"; // Commented out for now
