import { ReactNode } from "react";

/**
 * Enforces accessibility by strictly requiring at least one form of labeling:
 * either a visual \`label\`, an \`aria-label\`, or an \`aria-labelledby\`.
 */
export type RequireAccessibleLabel<T> = T &
  (
    | { label: ReactNode; "aria-label"?: string; "aria-labelledby"?: string }
    | { label?: ReactNode; "aria-label": string; "aria-labelledby"?: string }
    | { label?: ReactNode; "aria-label"?: string; "aria-labelledby": string }
  );
