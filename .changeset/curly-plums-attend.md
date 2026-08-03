---
"@recursica/mantine-adapter": patch
---

Fixed AssistiveElement not being exported from the package's public entry point (it existed as a component but was missing from both the internal component barrel and the top-level package export, making it unreachable via `import { AssistiveElement } from "@recursica/mantine-adapter"`).
