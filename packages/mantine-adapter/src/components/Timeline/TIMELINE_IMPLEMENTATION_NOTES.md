# Timeline Implementation Notes

## Architecture

The `Timeline` component is a strict structural wrapper around Mantine's `<Timeline>` and `<Timeline.Item>` components.

- `Timeline.tsx` intercepts overarching properties like `lineWidth` and `bulletSize` to strip them out via `overStyled`, strictly adhering to the CSS token mapping in `.item` rules instead.
- `TimelineItem.tsx` implements a custom `timestamp` React node rendering slot to match the design system, positioning the text directly below the item's `children`.
- `TimelineItem.tsx` supports a custom `bulletVariant` prop (`"default" | "avatar" | "icon" | "icon-alternative"`) mapped onto `data-variant` to handle CSS variations dynamically.

## Limitations & Missing Tokens

- **Avatar Bullet Size**: There is no specific pixel variable provided for the Avatar bullet size in the UI kit tokens (`avatar-size` evaluates to `"default"`). To maintain exact mathematical centering with Mantine's connector line `calc()` equations, the CSS falls back to inheriting the `default` bullet size (`20px`) for avatar nodes natively. If users supply a custom sized `img` tag, it must adhere to inline structural constraints or flex mappings.
