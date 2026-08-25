---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

**Breaking:** `Chip`'s `onRemove` prop is renamed to `onDelete` in both adapters, matching MUI's own `onDelete` naming and removing the previous internal aliasing between the two. Update any `Chip` usage passing `onRemove` to `onDelete` — the behavior (rendering the remove/X icon and firing on click or Enter/Space) is unchanged. `FileInput` and `FileUpload`'s own public props are unaffected; they only consume `Chip` internally.
