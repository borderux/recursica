---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Fixed descender clipping (e.g. the "g" in a long label) on single-line ellipsis truncation across Accordion, AutoComplete/Autocomplete, Button, Dropdown, Modal, and Panel — switched `overflow: hidden` to `overflow: clip; overflow-clip-margin: 0.35em`.
