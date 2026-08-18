---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

`FileUpload` now surfaces a built-in error message ("File type not accepted", overridable via the new `invalidFileTypeMessage` prop) when a dropped/picked file doesn't match `accept`, shown through the standard assistive-text error slot instead of requiring the integrator to wire up `onFilesRejected` themselves. Also reverts `FileUpload`'s assistive/error rendering back to `FormControlWrapper` (file list renders above the assistive/error text again, matching every other form control).

Fixes `Chip` clipping the descender (e.g. the "g" in "image.png") off long labels — `overflow: hidden` was clipping vertically as well as horizontally, cutting off glyph ink whenever the line-height token was tighter than the font's natural ascent+descent.
