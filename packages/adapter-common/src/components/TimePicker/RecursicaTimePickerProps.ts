/**
 * Props for the Recursica TimePicker component.
 */
export interface RecursicaTimePickerProps {
  /** Whether the seconds segment should be shown and editable. Defaults to `false`. */
  withSeconds?: boolean;
  /** Minimum possible time string. Format is `HH:mm` normally, or `HH:mm:ss` when `withSeconds` is true. */
  minTime?: string;
  /** Maximum possible time string. Format is `HH:mm` normally, or `HH:mm:ss` when `withSeconds` is true. */
  maxTime?: string;
}
