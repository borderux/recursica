# Menu Implementation Notes

- **Compositional API Dropped:** Mantine uses `<Menu.Target>`, `<Menu.Dropdown>`, `<Menu.Item>`, etc., and manages state natively via React context within `<Menu>`. MUI's API is fully monolithic.
- **Monolithic API Adopted:** Following architectural review, we have abandoned the fabricated context wrappers for `mui-adapter`. We now natively export `Menu`, `MenuItem`, and `MenuDivider` wrapping their `@mui/material` counterparts. Developers are expected to manage `anchorEl` state themselves, just like native MUI. Storybook tests have been updated to simulate this open state so visual regressions still cover the dropdown menu visually.
