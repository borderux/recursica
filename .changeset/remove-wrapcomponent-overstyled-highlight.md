---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Removed `wrapComponent` and the `overStyled` dev-mode highlight/console-toggle machinery (`toggleGlobalOverStyled`, `useGlobalOverStyled`, `injectOverStyledStyles`, `registerOverStyledConsoleCommand`) from `adapter-common` — overly complicated for what it did. Components are now exported directly, unwrapped. The `overStyled={true}` escape-hatch prop and its style-filtering behavior are unchanged. Dropped the "Over Styling" Storybook story and the matching section of `OVERSTYLING.md`/`RecursicaThemeProvider` docs that described the removed console command.
