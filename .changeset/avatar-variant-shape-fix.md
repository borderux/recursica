---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Avatar (MUI): fixed `variant` being fed into MUI's native shape prop instead of a color treatment, making it a silent no-op. Also documented `children` in the shared prop types and added missing mui-adapter implementation notes.
