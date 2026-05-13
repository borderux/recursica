# Box Implementation Notes

## `sx` Prop Exemption

By design, the `Box` component is the most permissive primitive in the UI kit. It explicitly allows the `sx` prop to pass through to the underlying MUI `Box`. It does not use any strict styling gatekeepers (`RecursicaOverStyled`, `filterSxProp`). It is intended to be used as a final escape hatch when the standard layout primitives or design system tokens cannot fulfill a unique layout requirement.
