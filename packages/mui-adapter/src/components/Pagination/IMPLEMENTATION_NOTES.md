# Pagination Implementation Notes

- **Compositional API Dropped:** Mantine's original `Pagination` component relies heavily on dot-notation sub-components (`Pagination.Root`, `Pagination.Items`, `Pagination.Control`, etc.). MUI's `<Pagination>` is fundamentally monolithic. Following architectural review, we have decided to drop the dot-notation wrappers for `mui-adapter` and rely strictly on MUI's monolithic API. Storybook and visual regression tests have been updated to reflect this divergence while retaining core property mapping compatibility.
