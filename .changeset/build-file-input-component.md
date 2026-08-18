---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

Implement the `FileInput` component (single-line, `TextField`-shaped file picker with a native drag-and-drop drop target, single- and multiple-file modes, and a trailing clear icon) in `mantine-adapter` and `mui-adapter`, replacing the "coming soon" stub, with a shared `RecursicaFileInputProps` contract in `adapter-common` reusing `FileUpload`'s `RecursicaFileUploadItem`/validation interface (`accept`/`maxSize`/`maxFiles`/`readOnly`). Also adds `FileInput` to `RECURSICA_COMPONENTS` and moves `mui-adapter`'s export of it into the standard `wrapComponent` set (it was previously exported unwrapped, alongside the polymorphic layout primitives, as a leftover from its stub form).
