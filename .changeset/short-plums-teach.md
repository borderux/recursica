---
"@recursica/adapter-tester": minor
---

`adapter-tester.config.json` is now validated against a published JSON schema (`dist/adapter-tester.schema.json`) — unknown fields and wrong types fail fast with a specific error. Reference it via `"$schema"` for editor autocomplete.
