# Accordion – implementation notes

Decisions and design tweaks strictly tailored for the UI Kit's Accordion wrapped against `@mantine/core`. Use this when managing components possessing deeply nested state logic (e.g., active toggles, nested headers mapping external design properties).

---

## 1. Hybrid Composition API (Smart Rendering Flow)

**Decision:** We fundamentally maintain the exact library composition API structure (`<Accordion>`, `<Accordion.Item>`, `<Accordion.Control>`, `<Accordion.Panel>`) while actively supporting an auto-completing flattened prop schema matching the unified Recursica API (`title`, `leftIcon`, `divider`).
**Implementation:** Avoid rigid raw parameter dumps. Mantine dynamically injects explicit `id` logic, keyboard ARIA mapping, and focus tracking correctly across `Control` to `Panel` DOM connections natively. By exposing the hierarchical mapping 1:1, Recursica safely adopts these capabilities. However, to strictly support Recursica's unified prop mapping interface:

- **Auto-Construction:** If integrators natively pass `title` and/or `leftIcon` props into `<AccordionItem>`, the component structurally auto-generates the internal `AccordionControl` sub-wrappers mapping the text and SVG natively, whilst treating `children` implicitly as the Panel contents.
- **Graceful Falldown:** If `title` is heavily omitted, the node immediately falls backward into raw Mantine composability expecting integrators mapped `<Accordion.Control>` entirely manually.

---

## 2. Default Configuration Reset (`unstyled`)

**Decision:** We strip Mantine's inner styles away completely from Accordion mappings by leveraging React's default `variant="unstyled"`.
**Implementation:** In `Accordion.tsx`, `<MantineAccordion>` binds `variant="unstyled"`. This effectively deletes Mantine's precomputed padding, borders, and shadow mappings allowing our targeted `classNames` inside `Accordion.module.css` to become the exact source of foundational truth without "fighting" `!important` tags or unpredictable flex-layouts inherited globally.

---

## 3. Strict SVG Icons Wrapper (`.iconLeftWrapper`)

**Decision:** Identical logic enforced as seen within Buttons: SVG scales dynamically inside `.mantine-leftSection` based on SVGs internal definition boundaries potentially corrupting header gaps.
**Implementation:** `AccordionControl` captures `<span className={styles.iconLeftWrapper} aria-hidden>` forcing `object-fit: contain` mapped exactly to the `properties_icon-left-size` Recursica dimension token forcing integrator SVG overrides inline perfectly.

---

## 4. Transparent Global Hover Fixes

**Decision:** We nullify internal Mantine button hover actions and exclusively utilize Recursica's hover structure natively.
**Implementation:** We construct `.control::after` pseudo-objects dynamically pulling our `hover-color` & `hover-opacity` bindings. Mantine's native action sets `.control:hover { background-color: var(...) }` dynamically causing internal layer overlaps. We enforce `background-color: transparent` strictly overriding it, preserving our pseudo-overlay layer-cascade cleanly.

---

## 5. Active Target Hooks (`[data-active]`)

**Decision:** Collapsed and expanded state tracking requires separate background maps across `AccordionItem`.
**Implementation:** Rather than syncing React `useState` hooks matching `Accordion.value`, we defer to Mantine's inherent DOM mapping: `.item[data-active]` implicitly triggers exactly when Mantine registers an expansion state swap changing values down dynamically on the element layer, perfectly binding to `--recursica_..._background-expanded`.

---

## 6. Nullifying Isolated State Bounds (`open` boolean)

**Decision:** We do not bind isolated `open={true}` state properties natively on individual `<AccordionItem>` configurations.
**Implementation:** Recursica natively dictates an item-level `open` tracking mapping. However, internally mapping boolean flags structurally across specific tree nodes heavily corrupts Mantine's DOM layout algorithms mapping parent-driven transition listeners. Mantine forces all expanded-height logic to run symmetrically off the `<Accordion value="...">` string matching array to accurately bind ARIA transitions. We explicitly ignore isolated item `<AccordionItem open={...}>` booleans to shield the rendering sequence cleanly.
