/**
 * withCallerOverride
 *
 * Resolves a single prop where Recursica supplies a default but the caller should be able to
 * override it. Use this only when the default can't be expressed as a plain destructured default
 * (`const { variant = "solid" } = props`) — e.g. the default is computed from other props/state
 * inside the component body, so it isn't known until after `rest` has already been destructured.
 *
 * Do not rely on spread order for this (`{...sanitizedProps, ...overrides}` never carries this
 * intent implicitly) — resolve the value explicitly and place the result in `overrides`.
 *
 * @param ourDefault - The value Recursica falls back to when the caller didn't supply one
 * @param callerValue - The raw value from the caller's props, if any
 * @returns `callerValue` if defined, else `ourDefault`
 */
export function withCallerOverride<T>(
  ourDefault: T,
  callerValue: T | undefined,
): T {
  return callerValue !== undefined ? callerValue : ourDefault;
}
