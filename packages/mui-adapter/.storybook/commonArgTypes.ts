/**
 * commonArgTypes.ts
 *
 * This file centralizes the standard Storybook Controls (ArgTypes) for all UI Kit
 * components that natively wrap or extend the `FormControlWrapper`.
 *
 * PHILOSOPHY:
 * Recursica ensures strict unified design boundaries across all form inputs (TextField,
 * CheckboxGroup, Dropdown, etc.). Because they all share the exact same label structures,
 * layout variants (stacked vs side-by-side), and assistive text bindings natively supplied
 * by the `FormControlWrapper`, their Storybook experiences should be exactly identical.
 *
 * USAGE:
 * Rather than recreating these controls inside every `Component.stories.tsx` file,
 * developers must spread this object directly into the `argTypes` of their story default block:
 *
 * ```tsx
 * import { formControlArgTypes } from "../../.storybook/commonArgTypes";
 *
 * export default {
 *   component: TextField,
 *   argTypes: {
 *     ...formControlArgTypes,
 *     // Component-specific argTypes below...
 *   }
 * }
 * ```
 */
import type { ArgTypes } from "@storybook/react";

export const formControlArgTypes: Partial<ArgTypes> = {
  formLayout: {
    control: "inline-radio",
    options: ["stacked", "side-by-side"],
    description:
      "Determines the structural flow layout of the Label relative to the Input.",
    table: {
      category: "Form Layout",
    },
  },
  labelSize: {
    control: "inline-radio",
    options: ["default", "small"],
    description:
      "Adjusts the typographical boundaries bounding the Label section.",
    table: {
      category: "Form Layout",
    },
  },
  labelAlignment: {
    control: "inline-radio",
    options: ["left", "right"],
    description:
      "Adjusts the explicit text alignment axis exclusively evaluating side-by-side structures.",
    table: {
      category: "Form Layout",
    },
  },
  labelOptionalText: {
    control: "text",
    description:
      "Optional secondary stylistic text injected alongside the primary Label node.",
    table: {
      category: "Form Layout",
    },
  },
  labelWithEditIcon: {
    control: "boolean",
    description:
      "Dynamically toggles interactivity hooks revealing the Edit context icon.",
    table: {
      category: "Form Layout",
    },
  },
  description: {
    table: {
      disable: true,
    },
  },
  assistiveText: {
    control: "text",
    description:
      "Helper instructions safely dynamically anchored below the input box natively outperforming description.",
    table: {
      category: "Form Layout",
    },
  },
  assistiveWithIcon: {
    control: "boolean",
    description:
      "Toggles native Recursica Info-styling rendering universally alongside the assistive block.",
    table: {
      category: "Form Layout",
    },
  },
  error: {
    control: "text",
    description:
      "Dynamically maps error feedback validation strings rendering explicit error states.",
    table: {
      category: "Form State",
    },
  },
  required: {
    control: "boolean",
    description:
      "Native DOM compliance flag explicitly marking the field as required natively.",
    table: {
      category: "Form State",
    },
  },
  disabled: {
    control: "boolean",
    description:
      "Globally disables interactive components bounding all click and focus logic natively.",
    table: {
      category: "Form State",
    },
  },
  withAsterisk: {
    control: "boolean",
    description:
      "Visually forces the mandatory asterisk presence completely independent of logical 'required' attribute properties.",
    table: {
      category: "Form State",
    },
  },
  labelActionArea: {
    table: {
      disable: true,
    },
  },
  onLabelEditClick: {
    table: {
      disable: true,
    },
  },
  controlMaxWidth: {
    table: {
      disable: true,
    },
  },
  controlMinWidth: {
    table: {
      disable: true,
    },
  },
};
