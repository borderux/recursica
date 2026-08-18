---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

`FileUpload` now supports a `maxFiles` prop (with an overridable `maxFilesMessage`, defaulting to "Maximum of {maxFiles} files allowed") that rejects files past a total-count cap the same way `accept`/`maxSize` already do.

Fixes `Chip` rendered without a real handler (`onRemove`/`onClick`/`onChange`) — such as `FileUpload`'s `readOnly` file list — still showing a pointer cursor on hover and picking up a phantom, un-styled keyboard Tab stop on its truncated label text. Both were general `Chip` bugs, not specific to `FileUpload`.
