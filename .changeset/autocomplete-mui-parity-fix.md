---
"@recursica/mui-adapter": patch
---

Autocomplete (MUI): fixed four bugs, all traced to `renderInput` discarding MUI's `InputProps` (dropping the `classes.inputRoot` className, the anchor ref, and adornment slots). Restored `InputProps` so the design-system border/padding actually applies instead of MUI's default underline chrome; wired `leftSection`/`rightSection` into `startAdornment`/`endAdornment` (previously destructured but never rendered, so icons never showed); and stopped coercing `error` to a boolean before the wrapper, which was discarding the error message string (ErrorState story showed no assistive text).
