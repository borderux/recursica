---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

Implement the `FileUpload` component (drag-and-drop dropzone, browse-button fallback, removable file-chip list) in `mantine-adapter` and `mui-adapter`, replacing the "coming soon" stub, with a shared `RecursicaFileUploadProps`/`RecursicaFileUploadItem` contract in `adapter-common`. Also fixes `mui-adapter`'s `Chip` component's public type to allow `children` (a pre-existing type-only gap; the component already accepted them at runtime).
