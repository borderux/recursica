import {
  type RecursicaComboboxData,
  type RecursicaComboboxItemWithLabel,
} from "../components/Combobox/RecursicaComboboxItem";

/**
 * Backfills `label` (falling back to `value`) on every item, so downstream rendering can always
 * read a real `label` string instead of re-deriving the same fallback at every call site.
 */
export function normalizeComboboxData(
  data: RecursicaComboboxData | undefined,
): (string | RecursicaComboboxItemWithLabel)[] | undefined {
  return data?.map((item) =>
    typeof item === "string"
      ? item
      : { ...item, label: item.label ?? item.value },
  );
}
