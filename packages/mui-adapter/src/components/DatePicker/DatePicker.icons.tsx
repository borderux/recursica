import React from "react";

/**
 * Default calendar icon rendered in the field's open-picker button (start position, see
 * DatePicker.tsx). Consumers can override it by passing their own `slots.openPickerIcon`.
 * Rendered by MUI X as an `SvgIcon`-like component and handed `className`/`style` only — sized/
 * colored entirely via the generic `.section :global(svg)` rule in DatePicker.module.css, same
 * convention as the mantine-adapter's CalendarIcon.
 */
export function CalendarIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
