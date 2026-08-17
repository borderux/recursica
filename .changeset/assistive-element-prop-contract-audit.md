---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

AssistiveElement: `assistiveVariant="error"` now defaults `role="alert"` in both adapters so
error text is announced by assistive tech as it appears or changes (an explicit `role` still
wins). Also (MUI only) closed a prop-contract conflict where native `error`/`component` could
silently override Recursica's own computed values, added the missing `RecursicaOverStyled`
wrapper, and hardened a CSS specificity tie against MUI's own `.Mui-error` color. Documented
`children` in `RecursicaAssistiveElementProps.ts` and added implementation notes to both adapters.
