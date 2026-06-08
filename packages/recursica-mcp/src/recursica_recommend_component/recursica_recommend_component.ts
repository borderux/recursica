import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import { recommendation_header } from "./recommendation_header.js";
import { integration_rules } from "./integration_rules.js";
import { no_match_fallback } from "./no_match_fallback.js";

export const recursica_recommend_component: Command = {
  name: "recursica_recommend_component",
  description,
  inputSchema: {
    type: "object",
    properties: {
      requirement: {
        type: "string",
        description:
          "Description of the UI requirement (e.g. 'a grid of cards', 'a form input with field description', 'a collapsible list').",
      },
      adapter: {
        type: "string",
        description:
          "Optional filter for a preferred adapter (e.g. 'mantine' or 'mui').",
      },
    },
    required: ["requirement"],
    additionalProperties: false,
  },
  handler: async (args, { allAdapters }) => {
    const reqInput = (args?.requirement as string).toLowerCase();

    // Structured component lookup guidelines
    const recommendationMap = [
      {
        keywords: [
          "collapse",
          "expand",
          "accordion",
          "collapsible",
          "details",
          "summary",
          "toggle list",
        ],
        component: "Accordion",
        explanation:
          "Accordion maps collapsible items where content is shown or hidden dynamically. It is ideal for structured content, FAQs, or nested option sets.",
      },
      {
        keywords: [
          "modal",
          "dialog",
          "popup",
          "overlay",
          "settings modal",
          "confirm dialog",
        ],
        component: "Modal",
        explanation:
          "Modal is the standard system-level blocking overlay. Essential for heavy user configurations, action confirmations, or full form wizards.",
      },
      {
        keywords: [
          "button",
          "click control",
          "action button",
          "submit button",
          "trigger button",
        ],
        component: "Button",
        explanation:
          "Button is the main interactive trigger for actions, submissions, or navigation contexts. Supported in filled, light, subtle, and outline styles.",
      },
      {
        keywords: ["tooltip", "hover label", "hint", "info icon help"],
        component: "Tooltip",
        explanation:
          "Tooltip is a small informative label that appears on hover, ideal for quick help definitions without disrupting workflow.",
      },
      {
        keywords: [
          "hover menu",
          "hovercard",
          "rich popup hover",
          "preview hover",
        ],
        component: "HoverCard",
        explanation:
          "HoverCard displays rich content (images, profile metadata, or detailed summaries) when a user hovers over an element.",
      },
      {
        keywords: ["popover", "rich menu button", "custom dropdown popup"],
        component: "Popover",
        explanation:
          "Popover is a non-blocking rich content container anchored to an active element, triggered by clicks or hover controls.",
      },
      {
        keywords: [
          "input",
          "text",
          "form field",
          "textfield",
          "value text",
          "name field",
        ],
        component: "TextField",
        explanation:
          "TextField handles standard text, email, or password data inputs. Follows Form Control guidelines.",
      },
      {
        keywords: ["textarea", "long text", "comment", "description field"],
        component: "TextArea",
        explanation:
          "TextArea handles multi-line paragraph text inputs natively mapped with appropriate row sizing.",
      },
      {
        keywords: [
          "number",
          "integer",
          "decimal",
          "currency input",
          "age field",
          "numeric",
        ],
        component: "NumberInput",
        explanation:
          "NumberInput handles strict numeric inputs, validating numeric constraints and precision natively.",
      },
      {
        keywords: [
          "select",
          "dropdown",
          "option picker",
          "select field",
          "combobox",
        ],
        component: "Dropdown",
        explanation:
          "Dropdown handles single or multi-value selections from lists. Features search and tag capabilities.",
      },
      {
        keywords: [
          "checkbox",
          "check list",
          "boolean input",
          "multi select list",
        ],
        component: "Checkbox",
        explanation:
          "Checkbox represents dual-state boolean options or selecting multiple values from a discrete array.",
      },
      {
        keywords: ["radio", "exclusive list", "exclusive option"],
        component: "Radio",
        explanation:
          "Radio handles mutually exclusive list selections (choose exactly one option).",
      },
      {
        keywords: ["switch", "toggle", "binary switch", "on/off switch"],
        component: "Switch",
        explanation:
          "Switch represents binary on/off actions that apply instantly (like settings toggles).",
      },
      {
        keywords: ["date", "calendar picker", "schedule date"],
        component: "DatePicker",
        explanation:
          "DatePicker handles date selections using standard integrated calendars reflecting design tokens.",
      },
      {
        keywords: ["time", "clock picker", "hour selector"],
        component: "TimePicker",
        explanation:
          "TimePicker handles custom scheduling hours and minute offsets.",
      },
      {
        keywords: [
          "vertical stack",
          "vertical layout",
          "column",
          "layout vertical",
          "spacing vertical",
        ],
        component: "Stack",
        explanation:
          "Stack represents a vertical flex container. Always use Stack with pre-configured 'rec-' spacing variables to lay out form fields or structural layers vertically.",
      },
      {
        keywords: [
          "horizontal stack",
          "horizontal layout",
          "row",
          "layout horizontal",
          "spacing horizontal",
        ],
        component: "Group",
        explanation:
          "Group represents a horizontal layout wrapper utilizing flexbox, useful for lining up buttons, chips, or inline control cards.",
      },
      {
        keywords: ["flexbox", "dynamic flex", "grid flex"],
        component: "Flex",
        explanation:
          "Flex provides a dynamic flex-layout escape hatch to lay out structural grids when raw control is required.",
      },
      {
        keywords: ["container", "width boundary", "max width wrapper"],
        component: "Container",
        explanation:
          "Container enforces global maximum width constraints, keeping content neatly aligned inside layout viewports.",
      },
      {
        keywords: ["badge", "pill", "tag display", "label pill"],
        component: "Badge",
        explanation:
          "Badge is a visual status indicator to flag categories, priorities, or counts.",
      },
      {
        keywords: ["chip", "interactive tag", "filter badge", "closable tag"],
        component: "Chip",
        explanation:
          "Chip is an interactive pill that supports select, deselect, or deletion actions.",
      },
      {
        keywords: ["tabs", "panel switch", "tab layout"],
        component: "Tabs",
        explanation:
          "Tabs manage multi-panel views that allow users to toggle between different sub-screens contextually.",
      },
      {
        keywords: [
          "segmented control",
          "button group select",
          "slide toggle control",
        ],
        component: "SegmentedControl",
        explanation:
          "SegmentedControl is a high-priority sliding visual toggle between mutually exclusive options, perfect for fast sub-section filtering.",
      },
      {
        keywords: ["steps", "stepper", "wizard workflow"],
        component: "Stepper",
        explanation:
          "Stepper displays a multi-step guided progress flow (e.g. step 1, step 2, step 3).",
      },
      {
        keywords: ["timeline", "history", "activity log"],
        component: "Timeline",
        explanation:
          "Timeline shows a chronological progress of events, logs, or history states visually.",
      },
      {
        keywords: ["toast", "notification popup", "alert alert alert"],
        component: "Toast",
        explanation:
          "Toast is a temporary, system-level flash alert displaying successful operations, warnings, or errors dynamically.",
      },
    ];

    let matchedRecommendation = recommendationMap.find((item) =>
      item.keywords.some((kw) => reqInput.includes(kw)),
    );

    let output = recommendation_header.replace(
      "{{requirement}}",
      args?.requirement as string,
    );

    if (matchedRecommendation) {
      output += `### Recommended Component: \`<${matchedRecommendation.component}>\`\n\n`;
      output += `**Why this matches**: ${matchedRecommendation.explanation}\n\n`;

      // Check if this component is implemented in any active adapters
      let adapterSupport = "";
      for (const adapter of allAdapters) {
        const pathToCheck = path.join(
          adapter.absPath,
          "src",
          "components",
          matchedRecommendation.component,
        );
        if (fs.existsSync(pathToCheck)) {
          adapterSupport += `- **${adapter.name.toUpperCase()} Adapter**: Supported! ✅\n  \`import { ${matchedRecommendation.component} } from "@recursica/${adapter.dirName}";\`\n`;
        } else {
          adapterSupport += `- **${adapter.name.toUpperCase()} Adapter**: *Not yet implemented* ❌\n`;
        }
      }

      output += `**Adapter Support Status:**\n${adapterSupport}\n\n`;
      output += integration_rules + "\n";
      output += `*Tip: To see detailed API properties, call tool \`recursica_get_component_doc\` for component name "${matchedRecommendation.component}".*\n`;
    } else {
      output += no_match_fallback;
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
