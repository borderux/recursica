import React from "react";

/**
 * mergeStyles
 *
 * Per-slot merge for a `styles` prop (e.g. Mantine's StylesApi) against Recursica's own default
 * inline styles for that slot. Mirrors `mergeClassNames`'s shape but the merge is a plain object
 * merge instead of a string concat, since each slot's value is a `CSSProperties` object, not a
 * class list: the caller's individual style properties override ours property-by-property
 * without dropping properties they didn't touch.
 *
 * Merges over the UNION of slots in `ours` and `callerValue`, not just `ours`'s keys — same
 * reasoning as `mergeClassNames`: a caller may target a slot Recursica has no default for.
 *
 * @param ours - Recursica's own per-slot default styles, if any
 * @param callerValue - The caller's `styles` prop, if any
 * @returns a new styles object covering every slot named by either side
 */
export function mergeStyles<
  T extends Record<string, React.CSSProperties | undefined>,
>(
  ours: T,
  callerValue: Partial<Record<keyof T, React.CSSProperties>> | undefined,
): T {
  if (!callerValue) return ours;

  const merged = { ...ours } as Record<string, React.CSSProperties | undefined>;
  const keys = new Set([...Object.keys(ours), ...Object.keys(callerValue)]);
  for (const key of keys) {
    const ourStyle = ours[key as keyof T];
    const callerStyle = callerValue[key as keyof T];
    merged[key] =
      ourStyle || callerStyle ? { ...ourStyle, ...callerStyle } : undefined;
  }
  return merged as T;
}
