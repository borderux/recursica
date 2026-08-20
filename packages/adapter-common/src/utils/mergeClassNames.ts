/**
 * mergeClassNames
 *
 * Per-slot merge for a `classNames` prop against Recursica's own CSS-module classes. This is
 * NOT the same shape as `withCallerOverride`: the caller's value must never fully replace ours,
 * because the underlying library's `classNames` slots are singular strings — replacing one
 * outright would drop the component's own module styles, not just extend them. Each slot keeps
 * Recursica's class and appends the caller's class for that slot if they supplied one.
 *
 * Merges over the UNION of slots in `ours` and `callerValue`, not just `ours`'s keys — a caller
 * may target a slot Recursica doesn't set a default class for (e.g. a library slot we never
 * needed to style ourselves). Restricting the loop to `ours`'s keys would silently drop that
 * slot instead of passing it through, the same class of prop-leakage bug this whole pattern
 * exists to prevent.
 *
 * @param ours - Recursica's own per-slot classNames (CSS module classes)
 * @param callerValue - The caller's `classNames` prop, if any
 * @returns a new classNames object covering every slot named by either side
 */
export function mergeClassNames<T extends Record<string, string | undefined>>(
  ours: T,
  callerValue: Partial<Record<keyof T, string>> | undefined,
): T {
  if (!callerValue) return ours;

  const merged = { ...ours } as Record<string, string | undefined>;
  const keys = new Set([...Object.keys(ours), ...Object.keys(callerValue)]);
  for (const key of keys) {
    const ourClass = ours[key as keyof T];
    const callerClass = callerValue[key as keyof T];
    merged[key] =
      [ourClass, callerClass].filter(Boolean).join(" ") || undefined;
  }
  return merged as T;
}
