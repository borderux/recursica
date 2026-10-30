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
 * Utility type to override margin and gap-shaped properties with RecursicaSpacing.
 *
 * Covers every spacing prop name used natively across the underlying kits (e.g. `gap`,
 * `gutter`, `spacing`) so each adapter can type its layout components
 * directly off the kit's own props without redeclaring a shared Recursica shape.
 */
export type WithRecursicaSpacing<T> = Omit<
  T,
  | "m"
  | "mx"
  | "my"
  | "mt"
  | "mb"
  | "ml"
  | "mr"
  | "gap"
  | "rowGap"
  | "columnGap"
  | "gutter"
  | "spacing"
> & {
  m?: string | number | RecursicaSpacing;
  mx?: string | number | RecursicaSpacing;
  my?: string | number | RecursicaSpacing;
  mt?: string | number | RecursicaSpacing;
  mb?: string | number | RecursicaSpacing;
  ml?: string | number | RecursicaSpacing;
  mr?: string | number | RecursicaSpacing;
  gap?: string | number | RecursicaSpacing;
  rowGap?: string | number | RecursicaSpacing;
  columnGap?: string | number | RecursicaSpacing;
  gutter?: string | number | RecursicaSpacing;
  spacing?: string | number | RecursicaSpacing;
};

/**
 * A wrapper type that blocks styling overrides unless `overStyled: true` is explicitly provided.
 *
 * `Allow` is constrained to `BlockedStylingKeys` so only genuinely-blocked keys can be un-blocked,
 * and defaults to `never` — `RecursicaOverStyled<T>` is byte-identical to the pre-`Allow` behavior.
 *
 * NOTE: this only lifts the *type-level* block. A component un-blocking a key is responsible for
 * consuming it (destructuring it before `filterStylingProps`, or otherwise handling it) so it does
 * not leak through the runtime styling filter.
 */
export type RecursicaOverStyled<T, Allow extends BlockedStylingKeys = never> =
  | (Omit<WithRecursicaSpacing<T>, Exclude<BlockedStylingKeys, Allow>> &
      Omit<ForbiddenStyles, Allow> & { overStyled?: false | undefined })
  | (WithRecursicaSpacing<T> & { overStyled: true });

/**
 * Base properties for Recursica label indicators.
 */
export interface RecursicaLabelProps {
  /**
   * Forge: axis `sizes` of the `label` contract (default, small).
   *
   * Specifies the sizing metrics natively mapping the Label boundaries. Only `default`/`small`
   * are defined by Recursica's Label tokens — `md` was never a real design size (no adapter had
   * a width rule for it) and has been removed; see docs/OPEN_DECISIONS.md #41 in beam-adapter.
   */
  labelSize?: "default" | "small";
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
  /**
   * Forge: axis `layouts` (stacked, side-by-side), present on `label`, `read-only-field`, every form-control
   * contract and the `*-group` contracts.
   *
   * Overall structural flow mapping the Form Control natively cascading down to Label and Input logic.
   */
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
 *
 * Each entry notes the Forge contract (`recursica_ui-kit.json`, `--recursica_ui-kit_components_<contract>_*`) it maps to.
 * Forge lists some parts as separate components (`*-item`, `*-group`, accordion and table parts); Recursica follows
 * Mantine's grouped structure and keeps them as children of one component. Names that differ: Radio is Forge's
 * `radio-button`; HoverCard and Popover share Forge's single `hover-card-popover`.
 */
export const RECURSICA_COMPONENTS = [
  // Forge: `accordion`; parts `accordion-item`, `accordion-header`, `accordion-content` are children (Item, Control, Panel).
  "Accordion",
  // Forge: `assistive-element`.
  "AssistiveElement",
  // Forge: `autocomplete`.
  "Autocomplete",
  // Forge: `avatar`.
  "Avatar",
  // Forge: `badge`.
  "Badge",
  // Not in Forge (layout primitive, intentionally outside the UI kit).
  "Box",
  // Forge: `breadcrumb`.
  "Breadcrumb",
  // Forge: `button`.
  "Button",
  // Forge: `card`.
  "Card",
  // Forge: `checkbox`; `checkbox-item` is a Checkbox inside a CheckboxGroup.
  "Checkbox",
  // Forge: `checkbox-group`.
  "CheckboxGroup",
  // Forge: `chip`.
  "Chip",
  // Not in Forge (layout primitive, intentionally outside the UI kit).
  "Container",
  // Forge: `date-picker`.
  "DatePicker",
  // Forge: `dropdown`.
  "Dropdown",
  // Not in Forge (helper, intentionally outside the UI kit).
  "EmptyValueRenderer",
  // Forge: `file-input`.
  "FileInput",
  // Forge: `file-upload`.
  "FileUpload",
  // Not in Forge (layout primitive, intentionally outside the UI kit).
  "Flex",
  // Not in Forge (structural helper; carries Forge's `layouts` axis as `formLayout`).
  "FormControlLayout",
  // Not in Forge (structural helper).
  "FormControlWrapper",
  // Not in Forge (layout primitive, intentionally outside the UI kit).
  "Group",
  // Not in Forge (typography, intentionally outside the UI kit components).
  "Heading",
  // Forge: `hover-card-popover` (one Forge contract shared with Popover).
  "HoverCard",
  // Forge: `label`.
  "Label",
  // Not in Forge (helper, intentionally outside the UI kit).
  "Layer",
  // Not in Forge (layout primitive, intentionally outside the UI kit).
  "LayoutGrid",
  // Forge: `link`.
  "Link",
  // Forge: `loader`.
  "Loader",
  // Forge: `menu`; `menu-item` is each Menu.Item.
  "Menu",
  // Forge: `modal`.
  "Modal",
  // Forge: `number-input`.
  "NumberInput",
  // Forge: `pagination`.
  "Pagination",
  // Forge: `panel`.
  "Panel",
  // Forge: `hover-card-popover` (one Forge contract shared with HoverCard).
  "Popover",
  // Forge: `radio-button` (kept as Radio); `radio-button-item` is a Radio inside a RadioGroup.
  "Radio",
  // Forge: `radio-button-group`.
  "RadioGroup",
  // Forge: `read-only-field`.
  "ReadOnlyField",
  // Forge: `segmented-control`; `segmented-control-item` is each `data` entry.
  "SegmentedControl",
  // Forge: `slider`.
  "Slider",
  // Not in Forge (layout primitive, intentionally outside the UI kit).
  "Stack",
  // Forge: `stepper`.
  "Stepper",
  // Forge: `switch`; `switch-item` is a Switch inside a SwitchGroup.
  "Switch",
  // Forge: `switch-group`.
  "SwitchGroup",
  // Forge: `table`; `table-cell`, `table-header`, `table-footer` are Table children (Td, Th, Tfoot).
  "Table",
  // Forge: `tabs`; `tabs-item` is each Tab.
  "Tabs",
  // Not in Forge (typography, intentionally outside the UI kit components).
  "Text",
  // Forge: `textarea`.
  "TextArea",
  // Forge: `text-field`.
  "TextField",
  // Forge: `time-picker`.
  "TimePicker",
  // Forge: `timeline`; `timeline-bullet` is each item's bullet.
  "Timeline",
  // Forge: `toast`.
  "Toast",
  // Forge: `tooltip`.
  "Tooltip",
  // Forge: `transfer-list`.
  "TransferList",
  // Forge: `tree`.
  "Tree",
  // Not in Forge (typography, intentionally outside the UI kit components).
  "Typography",
] as const;

/**
 * Union type of all Recursica components.
 */
export type RecursicaComponent = (typeof RECURSICA_COMPONENTS)[number];
