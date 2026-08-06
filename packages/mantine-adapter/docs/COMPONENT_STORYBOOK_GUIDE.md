<critical_agent_directive>
STOP AND READ THIS FIRST.
If you are an AI agent writing stories:

1. You MUST use Component Story Format 3 (CSF3). Do not use the older `storiesOf` API or CSF2 syntax.
2. You must NEVER import `@mantine/core` raw components into Storybook. Everything rendered must be Recursica components.
3. Do NOT manually wrap stories in `<Layer>`. The global Storybook decorator already wraps every story in a `<Layer layer={0}>` with `layer`/`withLayer` Story Controls (see §9). Only add an explicit `<Layer layer={N}>` inside a story when demonstrating the component on a specific non-default/nested layer — never as the default pattern.
   </critical_agent_directive>

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

- **Layer is automatic — do not wrap manually:** The global Storybook decorator (see §9) already wraps every story in a `<Layer layer={0}>`, and already exposes `layer`/`withLayer` Story Controls in the Controls panel. Do **not** add your own `<Layer>` wrapper in the Default story's render function, and do **not** add `layer`/`withLayer` to the component's own `argTypes` — both are provided globally.
- **Destructure, don't forward:** In the render function, destructure `withLayer` and `layer` out of `args` so React doesn't warn about unknown DOM attributes being spread onto the component (see §9 for the exact pattern).
- **Exception — demonstrating a specific/different layer:** Only add an explicit `<Layer layer={N}>` inside a story when you need to show the component on a layer _other than_ the one currently selected by the global control — for example, a dedicated `LayerOne` story, or a story composing multiple nested layers together. This is the exception, not something every component needs by default.

---

## 3. Static stories: fixed states for visual regression

- **Purpose:** Provide stable, snapshot-friendly states for visual regression testing and documentation. These stories have **no controls** (or minimal); they show fixed configurations.
- **Do not** create a story for every possible combination of props—that leads to too many stories and noise. Instead, focus on a **small set of major properties** that best demonstrate the component’s behavior and appearance.
- **Which properties to use:** This is **component-specific**. For each component, ask:
  - **“Which props would an integrator typically change, and which combinations are most important to lock down visually?”**
  - Choose a subset (e.g. 2–4 axes) and document the chosen axes in the story file or in this guide for that component.
- **Examples (by component):**
  - **Button:** Major axes might be `variant` (solid, outline, text), `size` (default, small), and a single “with icon” state. You typically do **not** need dedicated layer-specific static stories — every story already gets the global `layer` Story Control, so anyone can preview any story on any layer without a separate story existing for it. Only add a `<Layer layer={N}>`-wrapped static story (e.g. “Layer 1 Solid”) when you specifically want to lock down/document how the component looks composed inside a _non-default_ layer context (e.g. nested inside a Card) — this is the rare exception, not a required axis.
  - **Future components:** Apply the same question—pick the major properties that define how the component looks and behaves, then add a few static stories that cover the most important combinations or edge cases.
- **Implementation:**
  - Each static story is a **named export** that renders the component with fixed `args` (or no args and inline props). Do not rely on controls for these; the story should look the same every time.
  - **Single responsibility per story:** Do not attempt to pack multiple distinct semantic states (e.g., Disabled, Error) into a single overarching "State Variants" story block. Split them into discrete, isolated stories (e.g., `export const Disabled`, `export const Error`) to ensure clear visual regression snapshots without UI-grid overcrowding.
  - Use a clear naming convention (e.g. `SolidDefault`, `OutlineSmall`, `TextWithIcon`) so the story list is readable and regression reports are easy to interpret.
- **Result:** A set of static stories that can be used for visual regression (e.g. Chromatic, Percy, or a custom screenshot diff) and that document key states without overwhelming the sidebar.

---

## 4. Prompt for developers

When adding or updating static stories for a component, **decide explicitly** which properties to demonstrate:

1. List the component’s Recursica and key public props (layer is not a prop and not a default story axis — it's already covered by the global `layer` Story Control; see §9).
2. **Which of these are “major” for visual/documentation purposes?** (e.g. variant, size, loading, with/without icon.)
3. **Which combinations matter most?** (e.g. “all variants at default size” + “one variant at small size” + “one with icon”.) Only add a layer-specific story (using an explicit `<Layer layer={N}>`) if you need to lock down a _non-default_ layer composition — not as a routine combination.
4. Add one static story per chosen combination (or a small grid in one story if it fits better), and document in a short comment or in this guide which axes were chosen for that component.

This keeps the story count manageable and makes it clear why each static story exists.

---

## 5. Structure of the story file

- **Default export:** Meta object with `component`, `title` (e.g. under `Design System/Button`), `parameters.docs.description.component` exclusively documenting the purpose and layout usage of the element explicitly for the AutoDocs layout, and optionally `tags` for docs or tests (e.g., `["autodocs"]`).
- **Default / Primary story:** The “playground” story with controls (e.g. `export const Default` or the default story with `args` and `argTypes`).
- **Named exports:** One per static state (e.g. `SolidDefault`, `OutlineSmall`). Each uses fixed props and no (or minimal) controls.
- **Decorators:** If all stories need the same wrapper (e.g. theme context), add a decorator in the meta. For **layer**, do not add your own decorator or wrapper — the global preview decorator already wraps every story in a `<Layer>` with `layer`/`withLayer` Story Controls (see §9). Only wrap a specific story in `<Layer layer={N}>` yourself when demonstrating a non-default layer; never set layer as a component prop. Ensure the Recursica CSS (e.g. `recursica_variables_scoped.css`) is imported in the story file or in Storybook preview so variables resolve.

---

## 6. Visual regression and stability

- Static stories should be **deterministic:** same props and same environment (theme, layer, CSS loaded) every run.
- Avoid random data, timers, or async state that change the rendered output between runs.
- If a component has loading or error states, consider dedicated static stories (e.g. “Loading”, “Error”) with fixed props so they can be snapshotted reliably.

---

## 7. Checklist for a new component story file

- [ ] Story file is co-located: `{ComponentName}.stories.tsx` next to `{ComponentName}.tsx`.
- [ ] Component documentation exists explicitly mapping `parameters.docs.description.component` in the default meta object describing what the element fundamentally provides.
- [ ] Default (or primary) story exposes controls for the main props integrators will change.
- [ ] Major properties for static stories are chosen and documented (in the file or in this guide).
- [ ] Static stories are added for the chosen combinations; each has fixed props and no controls.
- [ ] No story manually wraps the component in `<Layer>` by default — the global decorator already handles this (see §9). An explicit `<Layer layer={N}>` is added only for a story that specifically demonstrates a non-default/different layer. Theme (and any other required context) are provided via decorators or wrapper so Recursica styles apply.
- [ ] Recursica CSS (e.g. `recursica_variables_scoped.css`) is loaded in the story or in Storybook preview.
- [ ] No native UI library components (like `@mantine/core` wrappers) are directly imported into the story. Everything rendered should strictly be Recursica components. Never use HTML primitive components (`div`, `span`, etc.) unless absolutely necessary to demo a story.

---

## 8. Strictly Recursica Components in Stories

**Do not import native UI-library components (e.g., `@mantine/core`) directly into `.stories.tsx` files.**

- **Why?** It defeats the purpose of the abstraction layer. If a Storybook user relies on the native library for padding, margins, formatting, or buttons during development playground usage, they are missing the raw limitations of the styling boundaries we impose natively.
- **Layouts:** Do not use HTML primitive components like `<div style={{...}}>` or `<span>` with inline styles to manually construct layouts. Always strive to use appropriate Recursica library components, particularly layout components like `Stack`, `Group`, `Flex`, and `Box`.
- **Solution:** Rely strictly on Recursica UI components that you have constructed natively (for example, import our wrapped `<Button>` over Mantine's raw `<Button>`). Use standard library layout primitives for all structural alignments to accurately reflect the design system.

---

## 9. Global Layer Decorator — Do NOT Manually Wrap

The Storybook preview (`preview.tsx`) provides a **global decorator** that automatically wraps every story in a `<Layer>` component with `withLayer` and `layer` controls. This means:

- **Do NOT** manually wrap your component in `<Layer layer={0}>` inside render functions **by default**. This is the single most common mistake to avoid when writing stories — it's redundant with the global decorator and easy to reach for out of habit.
- **Do NOT** add `layer` or `withLayer` to your component's `argTypes`—they are globally provided.
- **Exception:** manually wrapping in `<Layer layer={N}>` is appropriate only when a story specifically needs to demonstrate the component on a _different or additional_ layer than whatever the global control is set to (e.g. a dedicated `LayerOne` story, or a story composing several nested layers together). Reach for this deliberately, not by default.
- **DO** destructure `withLayer` and `layer` out of args in your render function so they don't get passed to the component:

```tsx
render: ({ withLayer, layer, ...args }: MenuStoryArgs) => {
  return <MyComponent {...args} />;
},
```

If you skip this destructure step, Storybook will pass `withLayer` and `layer` as DOM attributes, causing React warnings. If you use a bare `render: () =>` function that ignores args entirely, controls will have **no effect**.

---

## 10. Composable / Dot-Notation Components

Components that use a dot-notation composition API (e.g., `Menu`, `Accordion`, `Tabs`) require special attention for Storybook controls, because the props an integrator configures live on the **root component**, not on the children.

### Identifying controllable props

For composable components, the root component typically exposes **behavioral props** rather than visual props:

| Prop Category    | Examples                                     |
| ---------------- | -------------------------------------------- |
| Trigger behavior | `trigger` ("click", "hover", "click-hover")  |
| Positioning      | `position` ("bottom-start", "top-end", etc.) |
| State control    | `opened`, `defaultOpened`, `onChange`        |
| Layout tuning    | `offset`, `width`, `withArrow`               |
| Animation        | `transitionProps`                            |

These should be exposed as `argTypes` in the meta block with appropriate control types (`select`, `boolean`, `number`).

### Render function pattern

The Default story's render function should:

1. **Destructure** `withLayer` and `layer` out of args (global decorator handles these)
2. **Spread** remaining args onto the root component
3. **Hardcode** the children (sub-components like `Menu.Item`, `Accordion.Item` etc.)

```tsx
export const Default: Story = {
  args: {
    trigger: "click",
    position: "bottom-start",
    withArrow: false,
  },
  render: ({ withLayer, layer, ...args }: StoryArgs) => {
    return (
      <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Toggle Menu</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item>Messages</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  },
};
```

### Static stories for composable components

Static stories should showcase **content variations** (different child compositions) rather than prop permutations:

- `WithDividers` — Shows `Menu.Divider` + `Menu.Label` groupings
- `WithDisabledItems` — Fixed disabled item states
- `WithSubmenus` — Nested `Menu.Sub` hierarchies
- `HoverTrigger` — Fixed `trigger="click-hover"` behavioral variant

---

## 11. ReadOnly Framework & Visual Verification

**If a component utilizes `ReadOnlyControlProps` directly natively (like `TextField`), it must explicitly demonstrate these formatting hooks safely.**

1. **`readOnly` ArgType:** Add `readOnly` inside the `argTypes` block mapped functionally to `"boolean"` exposing the toggle natively in the baseline Default panel.
2. **Standard ReadOnly Static Story:** Provide, at absolute minimum, a core `StaticReadOnly` snapshot structurally freezing the ReadOnly mappings evaluating a standard text property (typically with `readOnly: true` and `value="Explicit ReadOnly Preview"`).
3. **Editable ReadOnly Constraint (If Applicable):** If bounding nodes via `onLabelEditClick`, explicitly verify the visual layout boundaries by creating `EditableReadOnly` evaluating `readOnly: true` accompanied by the `onLabelEditClick` callback (or `labelActionArea`) to ensure the interactive elements render flawlessly alongside frozen read data.

This securely ensures visual snapshot tests never miss parsing edge-case read text transitions.

---

## 12. Form Control Layout Standardization

**If a component utilizes the `FormControlWrapper` (like `TextField`, `Checkbox.Group`, `Dropdown`, etc.), you should inherit the universal Form Control `argTypes` map to ensure Storybook consistency.**

To provide a standardized testing interface for the macro-level visual layout boundaries across all wrapped form primitives natively, explicitly append the `formControlArgTypes` into the component's `argTypes` meta block.

1. **Import the Shared Mapping:** `import { formControlArgTypes } from "../../.storybook/commonArgTypes";`
2. **Inject the ArgTypes:** Safely spread the export dynamically directly alongside your component's localized variables:

```tsx
  argTypes: {
    ...formControlArgTypes,
    disabled: {
      control: "boolean",
    },
  },
```

This dynamically enables universal `formLayout`, `labelSize`, `labelAlignment`, `labelOptionalText`, and `labelWithEditIcon` UI panel hooks inside Storybook instantly without forcing you to manually re-declare controls boilerplate across every form component natively.
