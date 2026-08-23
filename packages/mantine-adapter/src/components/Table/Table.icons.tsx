import React from "react";

/**
 * Sort-direction indicators for `Table.Th`. Sized/colored entirely via the `.sortIcon` rule in
 * Table.module.css (currentColor + the header's own text-color token) — no width/height/color
 * hardcoded here on purpose, same convention as DatePicker.icons.tsx.
 */
export function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
