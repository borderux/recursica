---
"@recursica/mui-adapter": minor
---

Fix `Timeline`: rebuild `Timeline.Item` on Mui's `TimelineSeparator`/`TimelineDot`/`TimelineConnector`/`TimelineContent` primitives so the bullet marker, connecting line, active state, and bullet variants render (and left-align) like the Mantine adapter instead of not rendering at all.
