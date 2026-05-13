# Container Implementation Notes

## `sx` Prop Exemption

By design, the `Container` component explicitly allows the `sx` prop to pass through to the underlying MUI `Container`. Unlike standard UI kit components (which use the `RecursicaOverStyled` gatekeeper) or flex layout primitives (which strip `sx` via `OmitSx` and `filterSxProp`), `Container` acts as a structural boundary where advanced, one-off positioning adjustments may be required by the consuming application.
