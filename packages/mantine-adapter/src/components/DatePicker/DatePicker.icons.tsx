import React from "react";

/**
 * Default leading icon for DatePicker's left section. Consumers can override it by passing
 * their own `leftSection` prop (see DatePicker.tsx). Sized/colored entirely via the generic
 * `.section :global(svg)` rule in DatePicker.module.css, same as the icon in the
 * WithLeadingIcon story — no width/height/color hardcoded here on purpose.
 */
export function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
