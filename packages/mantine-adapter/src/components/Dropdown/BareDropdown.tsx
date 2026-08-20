import { forwardRef } from "react";
import {
  Select as MantineSelect,
  type SelectProps as MantineSelectProps,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Dropdown.module.css";

/**
 * Bare, unwrapped Select — no `FormControlWrapper`/`WithReadOnlyWrapper`, no label/assistiveText/
 * error/required. Tied to the same `Dropdown.module.css` variables/classes as the public
 * `Dropdown` component, so it looks identical, but is meant to be embedded inside another
 * component that already owns its own `FormControlWrapper` (e.g. `TimePicker`'s AM/PM control) —
 * nesting the full `Dropdown` there would double up `FormControl`/`FormControlLayout` wrapping.
 *
 * Not exported from this folder's `index.ts` — internal use only. Import it directly:
 * `import { BareDropdown } from "../Dropdown/BareDropdown"`.
 */
export interface BareDropdownProps
  extends Omit<
    MantineSelectProps,
    | "size"
    | "variant"
    | "radius"
    | "wrapperProps"
    | "label"
    | "description"
    | "error"
  > {
  data: MantineSelectProps["data"];
  /** Applies the error visual state (via `data-error`) — no error message is rendered here. */
  error?: boolean;
}

export type BareDropdownComponentProps = RecursicaOverStyled<BareDropdownProps>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "variant", // Colors/variants are token-driven; the library's native palette isn't exposed.
  "radius", // Recursica does not expose the library's native corner-radius system.
] as const satisfies readonly (keyof MantineSelectProps)[];

export const BareDropdown = forwardRef<
  HTMLInputElement,
  BareDropdownComponentProps
>(function BareDropdown(props, ref) {
  const { overStyled = false, className, disabled, error, ...rest } = props;
  const sanitizedProps = omitUnsupportedProps(
    filterStylingProps(rest, overStyled) as Record<string, unknown>,
    UNSUPPORTED_PROPS,
  );

  const mergedClassNames: Partial<Record<string, string>> = {
    wrapper: className ? `${styles.root} ${className}` : styles.root,
    input: styles.input,
    section: styles.section,
    dropdown: styles.dropdown,
    option: styles.option,
  };

  return (
    <MantineSelect
      ref={ref}
      {...(sanitizedProps as unknown as MantineSelectProps)}
      classNames={mergedClassNames}
      disabled={disabled}
      label={undefined}
      description={undefined}
      error={undefined}
      // `wrapperProps` targets Mantine's *outer* `Input.Wrapper` (the label/description/error
      // stacking element) — a different, ancestor element from the "wrapper" styles-api slot that
      // actually carries `styles.root`'s border/background. Dropdown.module.css's error/disabled
      // rules (`.root[data-error]`/`[data-disabled]`) need the attribute on that inner element, so
      // `attributes.wrapper` (which targets the same slot as `classNames.wrapper`/`styles.wrapper`)
      // is the correct hook here, not `wrapperProps`. See TIMEPICKER_IMPLEMENTATION_NOTES.md.
      attributes={{
        wrapper: {
          "data-disabled": disabled ? "true" : undefined,
          "data-error": error ? "true" : undefined,
        },
      }}
    />
  );
});

BareDropdown.displayName = "BareDropdown";
