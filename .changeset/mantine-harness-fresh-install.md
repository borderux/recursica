---
"@recursica/adapter-tester": patch
---

Mantine source-of-truth harness now names `@recursica/mantine-adapter` and `@recursica/storybook-template` explicitly on the install command, forcing npm to re-check both against the registry every run instead of trusting a stale `package-lock.json` — a bare `npm install` was silently skipping the network check once the lockfile was already satisfied, so runs could keep testing against an old published adapter version.
