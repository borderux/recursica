# Tabs Implementation Notes

- **Compositional API Dropped:** Mantine uses `<Tabs.List>`, `<Tabs.Tab>`, and `<Tabs.Panel>` natively with implicit context from `<Tabs>`. MUI relies on `@mui/lab/TabContext` and separates `Tabs` and `TabPanel`.
- **Monolithic API Adopted:** Following architectural review, we have opted to drop the broken dot-notation wrappers for `mui-adapter`. We now natively export `Tabs` (MUI List), `Tab` (MUI Item), and `TabPanel` (from `@mui/lab`). Developers must use `TabContext` (from `@mui/lab`) to manage state, just like native MUI. Storybook and visual regression tests have been updated to reflect this divergence while retaining core property mapping compatibility.
