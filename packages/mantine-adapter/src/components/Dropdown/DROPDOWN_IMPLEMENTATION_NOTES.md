# Dropdown Implementation Notes

The `Dropdown` component is mapped explicitly to Mantine's `<Select>` following the exact same strict encapsulation rules as `TextField`.

1. **Naked Primitive Mapping:** Mantine's `Select` natively executes macro-label generation. To decouple it, we explicitly disable internal labels (`label={undefined}`) and inject it purely inside our generic `FormControlWrapper`.
2. **Strict Dropdown Design Tokens:** The adapter implements strictly sandboxed styling utilizing only `--recursica_ui-kit_components_dropdown_...` variables. It explicitly does NOT inherit general `text-field` tokens despite geometric similarities, ensuring dropdown menus can be themed independently.
3. **Dropdown Appendages:** To correctly map Mantine's detached Popover `.dropdown` and list `.option` items, we targeted focus and geometric bindings appending standard padding structures matched to the dropdown height overrides dynamically into our `Dropdown.module.css`.
