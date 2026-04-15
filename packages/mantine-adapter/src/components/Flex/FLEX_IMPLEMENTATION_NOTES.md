# Flex Implementation Notes

The `Flex` component is a generic unopinionated flex layout wrapper mapped directly to Mantine's `Flex`.
It currently does not require any custom logical layouts or CSS workarounds since it serves only to provide absolute, raw manipulation of standard CSS flex properties. All spacing props (gap, align, justify, direction, wrap) pass safely through via the `filterStylingProps` layout-property allowance, with `rec-` dimension tokens scaling transparently mapped to standard gap limits.
