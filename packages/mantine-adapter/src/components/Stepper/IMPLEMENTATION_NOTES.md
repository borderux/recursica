# Stepper Implementation Notes

## Completed/current label & description colors never applied (source-of-truth audit, 2026-08-30)

**Bug:** `.step[data-progress="completed"]`, `.step[data-progress="progress"]`, and
`.step[data-progress="pending"]` selectors in `Stepper.module.css` checked `data-progress` for
literal string values (`"completed"`/`"progress"`/`"pending"`) that Mantine's `Stepper.Step` never
sets. Mantine actually stamps two independent boolean-presence attributes on the step root:
`data-completed` (present, value `"true"`, when the step index is before `active`) and
`data-progress` (present, value `"true"`, only on the active step); neither attribute exists at
all on upcoming steps. Since `[data-progress="completed"]` and `[data-progress="pending"]` never
match anything real, every step's label and description silently fell through to Mantine's own
unstyled defaults instead of any Recursica token — for description text specifically, that meant
Mantine's native muted/dimmed gray (`rgb(134, 142, 150)`, not any `--recursica_*` variable)
appeared on _every_ step regardless of state, including completed/current steps where the design
tokens (`..._completed-description-color`/`..._current-description-color`) both resolve to the
same near-black `layer-0_elements_text_color` as the label. This was visually indistinguishable
for labels (Mantine's own default text color happens to look close to black too) but clearly
visible for descriptions, and was mistaken for a mui-adapter bug (mui's class-based `.Mui-active`/
`.Mui-completed` selectors were already correctly reading these tokens, so mui rendered
completed/current descriptions in the token's actual dark color while mantine — the presumed
source of truth — rendered them in this incidental gray).

**Fix:** Match the same working pattern already used one selector up for `.stepIcon` (`.stepIcon
[data-completed]` / `.stepIcon[data-progress]`, which check attribute _presence_, not a value) —
changed the `.step` label/description rules to `[data-completed]` / `[data-progress]` /
`:not([data-completed]):not([data-progress])`. No `mui-adapter` change was needed for this: its
class-based state selectors were already correct against the design tokens.
