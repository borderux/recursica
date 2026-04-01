# Component Storybook Guide

This guide describes how to create Storybook stories for design-system components built with the [Component Development Guide](./COMPONENT_GUIDE_WALKTHROUGH.md). Use it when adding or updating stories for Recursica components (e.g. Button, future inputs, cards).

---

## 1. One story file per component

- **Location:** Co-locate the story file with the component. Use a single file: `{ComponentName}.stories.tsx` (or `.jsx`) in the same folder as the component.
- **Example:** For `src/design-system/components/Button/Button.tsx`, add `src/design-system/components/Button/Button.stories.tsx`.
- Storybook’s story glob will pick it up; no extra config is required.

---

## 2. Default story: controls for exploration

- **Purpose:** Let integrators and designers try the component with different props without editing code.
- **Implementation:**
  - Export a **default** story (or a primary named story) that renders the component and exposes **Storybook controls** for the main Recursica and relevant library/HTML props.
  - Map the component’s public API to control types (e.g. `variant` → select, `size` → select, `disabled` → boolean).
  - Use `args` and `argTypes` in the default export’s meta so every important prop is configurable.
- **Scope:** Include the props that an integrator is likely to change when using the component (e.g. variant, size, icon, disabled). You can omit rarely used or internal props if it keeps the Controls panel manageable. **Layer is not a component prop** (see **Layer and the Default story** below).
- **Result:** One interactive story where users can change props and see the result immediately.

---

## 2a. Layer and the Default story

- **Wrap in Layer:** The Default story must wrap the component in a `<Layer>` so layer context is visible. Render the component inside `<Layer layer={layer}>` where `layer` is a **story-level** arg (e.g. 0, 1, 2, 3), not a prop on the component.
- **Layer control:** Expose a **layer** control in the Default story that sets the wrapping Layer’s `layer` prop. This lets users see how the component looks in each layer. The control drives the Layer wrapper, not the component.
- **No component layer prop:** Components do not accept `layer` as a prop; layer is set only by wrapping content in `<Layer layer={0|1|2|3}>`. Do not add `layer` to the component’s props in the story. Add it only as a story-level arg and pass it to the Layer wrapper.

---

## 3. Static stories: fixed states for visual regression

- **Purpose:** Provide stable, snapshot-friendly states for visual regression testing and documentation. These stories have **no controls** (or minimal); they show fixed configurations.
- **Do not** create a story for every possible combination of props—that leads to too many stories and noise. Instead, focus on a **small set of major properties** that best demonstrate the component’s behavior and appearance.
- **Which properties to use:** This is **component-specific**. For each component, ask:
  - **“Which props would an integrator typically change, and which combinations are most important to lock down visually?”**
  - Choose a subset (e.g. 2–4 axes) and document the chosen axes in the story file or in this guide for that component.
- **Examples (by component):**
  - **Button:** Major axes might be `variant` (solid, outline, text), `size` (default, small), and a single “with icon” state. Layer is shown by wrapping in `<Layer>` (e.g. static stories “Layer 1 solid”, “Layer 2 outline” render `<Layer layer={1}><Button … /></Layer>`). You might have static stories such as “Solid default”, “Outline small”, “Text with icon”, “Layer 1 solid”, etc., without covering every combination.
  - **Future components:** Apply the same question—pick the major properties that define how the component looks and behaves, then add a few static stories that cover the most important combinations or edge cases.
- **Implementation:**
  - Each static story is a **named export** that renders the component with fixed `args` (or no args and inline props). Do not rely on controls for these; the story should look the same every time.
  - Use a clear naming convention (e.g. `SolidDefault`, `OutlineSmall`, `TextWithIcon`) so the story list is readable and regression reports are easy to interpret.
- **Result:** A set of static stories that can be used for visual regression (e.g. Chromatic, Percy, or a custom screenshot diff) and that document key states without overwhelming the sidebar.

---

## 4. Prompt for developers

When adding or updating static stories for a component, **decide explicitly** which properties to demonstrate:

1. List the component’s Recursica and key public props (layer is not a prop; use `<Layer>` in stories).
2. **Which of these are “major” for visual/documentation purposes?** (e.g. variant, size, loading, with/without icon, and layer via wrapping Layer.)
3. **Which combinations matter most?** (e.g. “all variants at default size” + “one variant at small size” + “one with icon” + “one per layer” using `<Layer layer={N}>`.)
4. Add one static story per chosen combination (or a small grid in one story if it fits better), and document in a short comment or in this guide which axes were chosen for that component.

This keeps the story count manageable and makes it clear why each static story exists.

---

## 5. Structure of the story file

- **Default export:** Meta object with `component`, `title` (e.g. under `Design System/Button`), and optionally `tags` for docs or tests.
- **Default / Primary story:** The “playground” story with controls (e.g. `export const Default` or the default story with `args` and `argTypes`).
- **Named exports:** One per static state (e.g. `SolidDefault`, `OutlineSmall`). Each uses fixed props and no (or minimal) controls.
- **Decorators:** If all stories need the same wrapper (e.g. theme context), add a decorator in the meta. For **layer**, wrap the component in `<Layer layer={N}>` in the Default story (with a layer control) and in any static story that should show a specific layer; do not set layer as a component prop. Ensure the Recursica CSS (e.g. `recursica_variables_scoped.css`) is imported in the story file or in Storybook preview so variables resolve.

---

## 6. Visual regression and stability

- Static stories should be **deterministic:** same props and same environment (theme, layer, CSS loaded) every run.
- Avoid random data, timers, or async state that change the rendered output between runs.
- If a component has loading or error states, consider dedicated static stories (e.g. “Loading”, “Error”) with fixed props so they can be snapshotted reliably.

---

## 7. Checklist for a new component story file

- [ ] Story file is co-located: `{ComponentName}.stories.tsx` next to `{ComponentName}.tsx`.
- [ ] Default (or primary) story exposes controls for the main props integrators will change.
- [ ] Major properties for static stories are chosen and documented (in the file or in this guide).
- [ ] Static stories are added for the chosen combinations; each has fixed props and no controls.
- [ ] Default story wraps the component in `<Layer layer={layer}>` with a layer control; static stories that need a layer use `<Layer layer={N}>` around the component. Theme (and any other required context) are provided via decorators or wrapper so Recursica styles apply.
- [ ] Recursica CSS (e.g. `recursica_variables_scoped.css`) is loaded in the story or in Storybook preview.
