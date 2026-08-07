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
  /**
   * Hides the AM/PM selector and switches to 24-hour entry. Defaults to `false` — by default
   * TimePicker renders a 12-hour input with a dedicated AM/PM control, a Recursica-specific
   * deviation from the underlying UI library's own default time entry pattern. See USAGE.md.
   */
  hideAmPm?: boolean;
}
