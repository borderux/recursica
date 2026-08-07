# TimePicker Implementation Notes

## Architecture Overview

The `TimePicker` component is a wrapper around the `@mantine/dates` `TimeInput` component, implementing the `FormControlWrapper` macro structure for Recursica. Unlike `DatePicker`, `TimeInput` is a masked text input (`HH:mm` or `HH:mm:ss`) with no calendar/dropdown UI, so this component follows the plain-`Input` pattern used by `TextField` rather than `DatePicker`'s dropdown-aware one.

## Structural Constraints

1. **Naked Input Usage**: `TimeInput` shares Mantine's generic `Input` styles API (`root`, `wrapper`, `input`, `section`), so it's wired up identically to `TextField.tsx` — no `label`/`description`/`error` are passed to it; `WithReadOnlyWrapper` > `FormControlWrapper` owns all of that.
2. **No calendar tokens needed**: The Recursica UI Kit's `time-picker` component exports a complete, self-sufficient token set (base properties, disabled/error states, stacked/side-by-side layout margins) with no popover/dropdown tokens — because `TimeInput` never renders one. No `--recursica_ui-kit_components_hover-card-popover_*` overrides are needed here, unlike `DatePicker`.
3. **Single icon slot**: the `time-picker` token set exposes one `colors_icon-color` token (not separate leading/trailing icon tokens like `text-field`), so `.section :global(svg)` uses a single color reference regardless of position.
4. **Read-Only Implementation**: Matches `DatePicker`'s approach — `readOnlyType="text"`, value passed through `String()`-safe rendering in `WithReadOnlyWrapper`.
5. **`withSeconds`/`minTime`/`maxTime`**: promoted to the shared `RecursicaTimePickerProps` contract in `adapter-common` since they're plain strings/booleans (not Mantine-specific types) and every adapter needs equivalent concepts for a time input.
