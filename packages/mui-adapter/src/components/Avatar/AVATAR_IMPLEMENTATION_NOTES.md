# Avatar Component Implementation Notes

## Architecture Decisions

The `Avatar` component is an adapter over MUI's `Avatar`.

- We do not wrap `MuiAvatar` in any custom standard `div` elements, preserving DOM structure.
- All styles strictly pull from explicit `--recursica_ui-kit_components_avatar_*` CSS tokens.

## `data-style`/`data-variant`, not MUI's own classes

Same reasoning as the Mantine adapter: `data-style="image|icon|text"` is set based on which of
`src`/`icon`/`children` is present, and `data-variant` carries Recursica's own `variant` value
(`"solid"|"outline"|"ghost"`) — `Avatar.module.css` keys every visual treatment (background,
border, border-radius) off these two attributes, not off anything MUI's own classes do.

## `variant` — a name collision with a different meaning, not a shared concept

**Found while auditing this component (not in Forge's original report):** MUI's native
`Avatar.variant` means **shape** (`'circular'|'rounded'|'square'`) — unlike almost every other
MUI component (including Mantine's `Avatar.variant`, which really is the same color-treatment
concept Recursica's `variant` is), MUI repurposes this name for something else entirely.

The previous implementation mapped Recursica's `variant` (`solid|outline|ghost`) to strings
(`"filled"|"outline"|"transparent"`) and fed them into MUI's native `variant` prop via an
`as unknown as MuiAvatarProps["variant"]` cast — none of those strings are valid MUI shape
values, so it was silently a no-op on MUI's own shape class (visually masked only because
`Avatar.module.css` already forces border-radius per `data-style` unconditionally, regardless
of what shape class MUI resolves to).

**Fix:** stopped feeding Recursica's `variant` into MUI's native `variant` prop at all.
`<MuiAvatar>` is now given an explicit, real, valid `variant="circular"` — Recursica has no
shape concept of its own to expose here, and avatars are always circular by design, so this is
just being explicit about that instead of relying on MUI's own default. `Omit<MuiAvatarProps,
"variant">` in the type prevents a caller from reaching MUI's real shape prop under Recursica's
`variant` name and getting confused about what it does.
