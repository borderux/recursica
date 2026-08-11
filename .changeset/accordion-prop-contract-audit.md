---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

Accordion: closed silent prop-contract conflicts where native `expanded`/`onChange`/`expandIcon`/`icon` could override Recursica's own computed state, made `variant` a real predefined union instead of a bare string, and formally supported a per-item `disabled` prop in both adapters.
Also documented `children` across all Accordion sub-components in `RecursicaAccordionProps.ts`, including a new `RecursicaAccordionPanelProps` interface for the Panel.
