import type { ComboboxItem as RecursicaComboboxItem } from "./index";
import "@mantine/core";

declare module "@mantine/core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface ComboboxItem extends RecursicaComboboxItem {}
}
