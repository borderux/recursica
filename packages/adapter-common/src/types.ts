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
 * Utility type to override margin and gap properties with RecursicaSpacing.
 */
export type WithRecursicaSpacing<T> = Omit<
  T,
  "m" | "mx" | "my" | "mt" | "mb" | "ml" | "mr" | "gap" | "rowGap" | "columnGap"
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
  /** Overall alignment directive for the label strings natively forcing Left/Right justification. */
  labelAlignment?: "left" | "right";
  /** Injects an indicator text block alongside the label. Can be boolean (`true` maps to '(Optional)') or custom React nodes. */
  labelOptionalText?: boolean | React.ReactNode;
  /** When true, forces the native Edit Icon to replace the standard asterisk visually. */
  labelWithEditIcon?: boolean;
  /** Custom action area to render alongside the label instead of the default edit icon. */
  labelActionArea?: React.ReactNode;
  /** Interaction hook invoked whenever a generated edit icon block natively triggers a click event. */
  onLabelEditClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Base properties required by any input control supporting native form wrapper layouts.
 */
export interface RecursicaFormControlWrapperProps extends RecursicaLabelProps {
  /** Overall structural flow mapping the Form Control natively cascading down to Label and Input logic. */
  formLayout?: "stacked" | "side-by-side";
  /** Securely replaces standard descriptions safely providing standard Assistive properties. */
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
  "Breadcrumb",
  "Button",
  "Card",
  "Checkbox",
  "Chip",
  "Container",
  "DatePicker",
  "Dropdown",
  "EmptyValueRenderer",
  "Flex",
  "FormControlLayout",
  "FormControlWrapper",
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
] as const;

/**
 * Union type of all Recursica components.
 */
export type RecursicaComponent = (typeof RECURSICA_COMPONENTS)[number];
