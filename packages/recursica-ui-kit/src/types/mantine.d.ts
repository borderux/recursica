import type { IconName } from "@/components/Icons/Icon";
import "@mantine/core";

declare module "@mantine/core" {
  export interface ComboboxItem {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: IconName;
  }
}
