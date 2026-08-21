import React from "react";

/**
 * Chevron rendered in the right section alongside the clear button (item 3a). Only used for that
 * combined case — MUI's own default `IconComponent` (`ArrowDropDown`) is left untouched everywhere
 * else, so this is a hand-rolled copy of the exact same MUI glyph path, not a new icon design.
 */
export function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

/** Clear ("x") icon for the clearable Dropdown's clear button (item 3a). */
export function ClearIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
