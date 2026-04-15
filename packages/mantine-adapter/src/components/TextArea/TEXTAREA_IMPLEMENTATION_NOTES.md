# TextArea Implementation Notes

The `TextArea` component is mapped explicitly to Mantine's `<Textarea>` following the same strict encapsulation rules as `TextField`.

1. **Naked Primitive Mapping:** Mantine's `Textarea` natively executes macro-label generation. To decouple it, we explicitly disable internal labels (`label={undefined}`) and inject it purely inside our generic `FormControlWrapper`.
2. **Text Field Token Re-Use:** Because text areas fundamentally share the same box-geometry, text, and state definitions as single-line inputs, it strictly implements the `--recursica_ui-kit_components_text-field_...` variables natively.
3. **Autosize Handling:** The component supports Mantine's raw `autosize`, `minRows`, and `maxRows` parameters out of the box dynamically via property passthrough.
