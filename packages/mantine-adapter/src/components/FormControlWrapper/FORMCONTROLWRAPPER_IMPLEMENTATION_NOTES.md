# FormControlWrapper Implementation Notes

## Architectural Philosophy

The `FormControlWrapper` is the ultimate structural replacement for Mantine's built-in `Input.Wrapper`. By abandoning Mantine's opinionated wrappers entirely across the design system, we centralize all label tracking, error rendering, ARIA generation, and grid layouts natively inside this single component.

### 1. Bypassing `Input.Wrapper`

Under the hood of Mantine, elements like `TextInput` heavily rely on `Input.Wrapper`. We actively discourage their use. The central tenet of Recursica Forms is to strip the UI primitive back to its "naked" form (e.g. `<Input />`, `<Checkbox />`) and encapsulate it manually inside `<FormControlWrapper>`.

- **Why?** It enforces complete layout mastery. It natively enables `formLayout="side-by-side"` and completely disables Mantine's margin collisions without requiring messy CSS hacks.

### 2. The `cloneElement` ARIA Map

Because we tore out Mantine's `InputContext` provider (which natively glued error strings to `<input>` tags using React Context), we explicitly utilize `React.cloneElement` on the nested children inside this wrapper.

- `aria-describedby` and `aria-errormessage` are dynamically generated using `React.useId()` and physically injected back onto the provided child node. Screen readers rely strictly on this mapping to announce the assistive fields correctly.

### 3. Strict `AssistiveElement` Coupling

We completely abandoned generic `<Input.Description>` tags. The `FormControlWrapper` directly renders `<AssistiveElement>` primitives, parsing them seamlessly mapping them to `"error"` or `"help"` variants automatically depending on the component's internal state machine.

### 4. Dynamic Geometric Variable Payloads

Because `FormControlWrapper` acts as an agnostic grid box encompassing raw primitives (like `TextField`, `Select`), it initially stretches `100%` across horizontal bounds.

- **The Bug:** If a child `TextField` carries its own hardcoded `max-width` token, it stops expanding early, but the wrapper and `<Label>` keep expanding, causing right-aligned labels to aggressively float past the field to the screen's edge dynamically.
- **The Variable Payload Resolution:** Instead of destroying grids with `width: fit-content` arrays, primitive components are required to pass their local `max-width` tokens UP to the wrapper explicitly via React `style`:
  ```tsx
  <FormControlWrapper style={{ "--form-control-max-width": "var(--...)" }}>
  ```
  The wrapper natively respects `max-width: var(--form-control-max-width, 100%)`. This structurally unifies the bounding caps so right-aligned labels flawlessly snap tightly to the explicit boundary edge of the specific primitive it is wrapping.
