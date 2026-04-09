# TextField Implementation Notes

## Architectural philosophy

The `TextField` primitive intentionally ignores Mantine's built-in `<TextInput>` structure in favor of directly binding against `<Input>`.

### 1. Bypassing `Input.Wrapper`

Because `<TextInput>` inherently renders Mantine's `Input.Wrapper` underneath the hood, utilizing it natively double-wraps our layouts causing massive DOM bloat and margin collapsing errors. By leveraging the completely naked `<Input>` primitive natively natively alongside `FormControlWrapper`, we retain full logical control of where the `label` maps, avoiding dual label conflicts or mis-aligned asterisks securely.

### 2. State Hooks (`wrapperProps`)

Because we target `<Input>`, all dynamic UI modifiers (`disabled`, `error`, etc) must strictly be applied to the `.root` CSS module to correctly style the internal `<input>` boxes AND the nested `.[data-position]` icon sections simultaneously.

To accomplish this safely without spilling random pseudo-variables onto the input parameters, we exclusively use Mantine's `<Input wrapperProps={{...}}>` block natively locking `.root[data-error]` to correctly map Recursica UI variable hooks without breaking the DOM hierarchy natively.

### 3. Component Definition Intersections

To strictly acquire native HTML typings, `TextField.tsx` explicitly extracts `React.ComponentPropsWithoutRef<"input">`. However, to prevent Typescript strict union collisions with overlapping Mantine definitions over functional `style` components and custom mappings natively, we meticulously omit (`Pick<InputWrapperProps, ...>`) explicit base elements to guarantee that strictly Recursica styles traverse the array flawlessly.
