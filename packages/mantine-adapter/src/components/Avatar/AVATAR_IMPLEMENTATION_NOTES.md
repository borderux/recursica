# Avatar Component Implementation Notes

## Architecture Decisions

The `Avatar` component is an adapter over Mantine's `Avatar`. To ensure adherence to the `COMPONENT_GUIDE_WALKTHROUGH.md`:

- We do not wrap `MantineAvatar` in any custom standard `div` elements, preserving DOM structure.
- All styles strictly pull from explicit `--recursica_ui-kit_components_avatar_*` CSS tokens.

## Structural Workarounds

### Implicit `data-style`

Mantine's Avatar implicitly renders an image, an icon, or a text node based on the properties passed (`src`, `var`, `children`).
Recursica Tokens split Avatar styling distinctly across three separate categories: `image`, `icon`, and `text`.
To correctly map these variables, our React component observes standard prop states and manually injects a `data-style="image|icon|text"` onto the root. The `Avatar.module.css` explicitly gates padding and generic sizing modifiers under these `data-style` attributes.

### Flex Layout & Internal Spans

Since Avatar children (icons or initials) require robust centering that might differ heavily across Recursica size mappings, all child content defaults to being wrapped in `span` elements (either `.textWrapper` or `.iconWrapper`). These spans enforce 100% height and flex formatting independent of the Mantine container constraints.

### CSS Reset Hacks

Noticeable `/* HARDCODE: ... */` hacks are deployed within `.root` to completely zero-out Mantine's `--avatar-bg` and internal variables statically since Recursica handles background-colors inherently via the CSS variants cascade.
