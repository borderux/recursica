---
"@recursica/adapter-common": minor
---

Added `RecursicaGridColProps` — currently just a `children` scaffold. `span`, `order`, `visibleFrom`, and `hiddenFrom` were drafted as a formal Grid.Col prop contract (mantine-v8 and mui-v7 had independently built matching `span`/`order` behavior, and `visibleFrom`/`hiddenFrom` need a Recursica-specific breakpoint naming convention that doesn't exist yet) but are commented out with a TODO, paused to get the rest of this Grid work merged. `offset` was never added — still undiffed between the two adapters.
