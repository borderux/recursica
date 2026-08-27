import React from "react";

/**
 * List of spacing keys supported by Recursica.
 */
export type RecursicaSpacing =
  | "rec-none"
  | "rec-sm"
  | "rec-default"
  | "rec-md"
  | "rec-lg"
  | "rec-xl"
  | "rec-2xl";

/**
 * List of standard sizes supported by Recursica.
 */
export type RecursicaSize = "small" | "default" | "large";

/**
 * Breakpoint keys shared by every responsive Recursica prop.
 *
 * `base` is the smallest/default breakpoint (Mantine's native default key). Adapters that use
 * a UI library without a `base` breakpoint (e.g. MUI) map `base` onto their smallest breakpoint
 * (`xs`) at the boundary, so the same responsive object works across every adapter.
 */
export type RecursicaBreakpoint = "base" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * A scalar value or a per-breakpoint responsive object.
 *
 * Structurally mirrors Mantine's `StyleProp<T>` and MUI's `ResponsiveStyleValue<T>`, so a value
 * typed as `Responsive<T>` intersects cleanly with either library's own responsive prop type
 * instead of collapsing to the bare scalar. Framework-agnostic on purpose — `adapter-common`
 * must never import a UI framework.
 *
 * The key includes `(string & {})` so consumers that add custom breakpoint names (e.g. Mantine's
 * `MantineThemeSizesOverride` module augmentation) can use them here too, mirroring Mantine's own
 * `StyleProp` key (`MantineBreakpoint | (string & {})`). The `RecursicaBreakpoint` literals are kept
 * for editor autocomplete; the `(string & {})` half is what permits augmented breakpoint keys.
 *
 * @example
 * ```tsx
 * <Flex direction={{ base: "column", xl: "row" }} />
 * ```
 */
export type Responsive<T> =
  | T
  | Partial<Record<RecursicaBreakpoint | (string & {}), T>>;

/**
 * Enforces accessibility by strictly requiring at least one form of labeling:
 * either a visual `label`, an `aria-label`, or an `aria-labelledby`.
 */
export type RequireAccessibleLabel<T> = T &
  (
    | {
        label: React.ReactNode;
        "aria-label"?: string;
        "aria-labelledby"?: string;
      }
    | {
        label?: React.ReactNode;
        "aria-label": string;
        "aria-labelledby"?: string;
      }
    | {
        label?: React.ReactNode;
        "aria-label"?: string;
        "aria-labelledby": string;
      }
  );

/**
 * List of styling keys that are blocked from being overriden unless overStyled is enabled.
 */
export type BlockedStylingKeys =
  | "className"
  | "classNames"
  | "classes"
  | "style"
  | "styles"
  | "vars"
  | "sx"
  | "p"
  | "px"
  | "py"
  | "pt"
  | "pb"
  | "pl"
  | "pr"
  | "bg"
  | "c"
  | "opacity"
  | "ff"
  | "fz"
  | "fw"
  | "lts"
  | "ta"
  | "lh"
  | "fs"
  | "tt"
  | "td"
  | "bd"
  | "bdw"
  | "bds"
  | "bdc"
  | "bdr"
  | "shadow"
  | "w"
  | "miw"
  | "maw"
  | "h"
  | "mih"
  | "mah"
  | "color"
  | "bgcolor"
  | "backgroundColor"
  | "typography"
  | "fontFamily"
  | "fontSize"
  | "fontWeight"
  | "lineHeight"
  | "letterSpacing"
  | "textAlign"
  | "border"
  | "borderTop"
  | "borderBottom"
  | "borderLeft"
  | "borderRight"
  | "borderColor"
  | "borderRadius"
  | "boxShadow"
  | "display"
  | "position"
  | "zIndex";

export type ForbiddenStyles = { [K in BlockedStylingKeys]?: never };

/**
 * Utility type to override margin properties with RecursicaSpacing.
 *
 * Margins map to Mantine's Box style props, which are responsive on every component, so they are
 * wrapped in {@link Responsive}. `gap`/`rowGap`/`columnGap` are intentionally NOT overridden here:
 * whether a gap is responsive depends on the specific component (Flex and Grid type it as a
 * responsive `StyleProp`; Stack and Group type it as a single value), so each component's own prop
 * interface decides, and this wrapper leaves gap to the underlying Mantine × Recursica intersection.
 */
export type WithRecursicaSpacing<T> = Omit<
  T,
  "m" | "mx" | "my" | "mt" | "mb" | "ml" | "mr"
> & {
  m?: Responsive<string | number | RecursicaSpacing>;
  mx?: Responsive<string | number | RecursicaSpacing>;
  my?: Responsive<string | number | RecursicaSpacing>;
  mt?: Responsive<string | number | RecursicaSpacing>;
  mb?: Responsive<string | number | RecursicaSpacing>;
  ml?: Responsive<string | number | RecursicaSpacing>;
  mr?: Responsive<string | number | RecursicaSpacing>;
};

/**
 * A wrapper type that blocks styling overrides unless `overStyled: true` is explicitly provided.
 */
export type RecursicaOverStyled<T> =
  | (Omit<WithRecursicaSpacing<T>, BlockedStylingKeys> &
      ForbiddenStyles & { overStyled?: false | undefined })
  | (WithRecursicaSpacing<T> & { overStyled: true });

/**
 * Base properties for Recursica label indicators.
 */
export interface RecursicaLabelProps {
  /** Specifies the sizing metrics natively mapping the Label boundaries. */
  labelSize?: "default" | "small" | "md";
  /**
   * Overall alignment directive for the label strings natively forcing Left/Right justification.
   * Not renamed to Forge's `labelAlign`: our own vocabulary, not either kit's native term.
   */
  labelAlignment?: "left" | "right";
  /**
   * Injects an indicator text block alongside the label. Can be boolean (`true` maps to '(Optional)') or custom React nodes.
   * Not renamed to Forge's `optional`: same reason as `labelAlignment` above.
   */
  labelOptionalText?: boolean | React.ReactNode;
  /** When true, forces the native Edit Icon to replace the standard asterisk visually. */
  labelWithEditIcon?: boolean;
  /** Custom action area to render alongside the label instead of the default edit icon. */
  labelActionArea?: React.ReactNode;
  /**
   * Interaction hook invoked whenever a generated edit icon block natively triggers a click event.
   * Not renamed to Forge's `onEditIconClick`: same reason as `labelAlignment` above.
   */
  onLabelEditClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Base properties required by any input control supporting native form wrapper layouts.
 */
export interface RecursicaFormControlWrapperProps extends RecursicaLabelProps {
  /** Overall structural flow mapping the Form Control natively cascading down to Label and Input logic. */
  formLayout?: "stacked" | "side-by-side";
  /**
   * Securely replaces standard descriptions safely providing standard Assistive properties.
   * Not renamed to Forge's `helpText`/`errorText`: our own vocabulary, covering both help and
   * error copy via one prop plus `assistiveVariant`; `description`/`helperText` below already
   * exist as native-API fallback aliases.
   */
  assistiveText?: React.ReactNode;
  /** Fallback description prop to match native APIs safely. */
  description?: React.ReactNode;
  /** Fallback helperText prop to match native APIs safely. */
  helperText?: React.ReactNode;
  /** Explicit toggle to suppress the Info icon rendering natively alongside the assistiveText. Defaults to true. */
  assistiveWithIcon?: boolean;
  /** Custom action area to render alongside the label instead of the default edit icon. */
  labelActionArea?: React.ReactNode;
  /** Pass the native maximum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMaxWidth?: string | undefined;
  /** Pass the native minimum width design variable dynamically bounding the specific wrapper width exclusively. */
  controlMinWidth?: string | undefined;
}

/**
 * Official list of all components in Recursica.
 */
export const RECURSICA_COMPONENTS = [
  "Accordion",
  "AssistiveElement",
  "Autocomplete",
  "Avatar",
  "Badge",
  "Box",
  "Breadcrumb",
  "Button",
  "Card",
  "Checkbox",
  "CheckboxGroup",
  "Chip",
  "Container",
  "DatePicker",
  "Dropdown",
  "EmptyValueRenderer",
  "FileInput",
  "FileUpload",
  "Flex",
  "FormControlLayout",
  "FormControlWrapper",
  "Grid",
  "Group",
  "HoverCard",
  "Label",
  "Layer",
  "Link",
  "Loader",
  "Menu",
  "Modal",
  "NumberInput",
  "Pagination",
  "Panel",
  "Popover",
  "Radio",
  "ReadOnlyField",
  "SegmentedControl",
  "Slider",
  "Stack",
  "Stepper",
  "Switch",
  "Table",
  "Tabs",
  "Text",
  "TextArea",
  "TextField",
  "TimePicker",
  "Timeline",
  "Title",
  "Toast",
  "Tooltip",
  "TransferList",
  "Tree",
  "Typography",
] as const;

/**
 * Union type of all Recursica components.
 */
export type RecursicaComponent = (typeof RECURSICA_COMPONENTS)[number];
