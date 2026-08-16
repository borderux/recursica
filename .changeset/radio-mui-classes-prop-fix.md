---
"@recursica/mui-adapter": patch
---

Fixed Radio rendering no visible circle (only the label) — `classes` was being read as `classNames` with Mantine-shaped slot names MUI doesn't support, so the circle's styling was silently dropped. Also fixed the label rendering vertically offset from the circle, disabled MUI's default click ripple, made description/error mutually exclusive (error wins), and reordered the props spread so it can no longer silently override the render-critical props placed after it.
