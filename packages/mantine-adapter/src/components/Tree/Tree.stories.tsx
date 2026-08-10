import type { Meta, StoryObj } from "@storybook/react";
import { Tree } from "./Tree";
import { Layer, type RecursicaTreeNode } from "@recursica/adapter-common";

const sampleData: RecursicaTreeNode[] = [
  {
    value: "documents",
    label: "Documents",
    children: [
      { value: "documents/resume.pdf", label: "resume.pdf" },
      { value: "documents/cover-letter.docx", label: "cover-letter.docx" },
      {
        value: "documents/taxes",
        label: "Taxes",
        children: [
          { value: "documents/taxes/2023.pdf", label: "2023.pdf" },
          { value: "documents/taxes/2024.pdf", label: "2024.pdf" },
        ],
      },
    ],
  },
  {
    value: "photos",
    label: "Photos",
    children: [
      { value: "photos/vacation.jpg", label: "vacation.jpg" },
      { value: "photos/family.jpg", label: "family.jpg" },
    ],
  },
  { value: "readme.md", label: "readme.md" },
];

const meta: Meta<typeof Tree> = {
  title: "UI-Kit/Tree",
  component: Tree,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Tree\` component renders hierarchical \`data\` as an expandable/selectable tree, wrapping \`@mantine/core\`'s \`Tree\` with a fully custom node renderer so every visual property (row box model, selected/unselected colors and typography, indent, item spacing) comes from Recursica's \`tree\` design tokens.

Each node needs a unique \`value\` and a \`label\`; a \`children\` array (even empty) makes a node expandable.
        `,
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Tree> = {
  render: () => (
    <Tree data={sampleData} initialExpandedValues={["documents"]} />
  ),
};

export const AllExpanded: StoryObj<typeof Tree> = {
  render: () => <Tree data={sampleData} initialExpandedValues="*" />,
};

export const PreSelected: StoryObj<typeof Tree> = {
  render: () => (
    <Tree
      data={sampleData}
      initialExpandedValues={["documents"]}
      initialSelectedValues={["documents/resume.pdf"]}
    />
  ),
};

export const MultipleSelection: StoryObj<typeof Tree> = {
  render: () => (
    <Tree
      data={sampleData}
      initialExpandedValues="*"
      initialSelectedValues={["documents/resume.pdf", "photos/vacation.jpg"]}
      multiple
    />
  ),
};

/** Whole tree disabled, with a node pre-selected so the selected chip's styling under the
 * disabled dimming can be checked alongside unselected rows. */
export const Disabled: StoryObj<typeof Tree> = {
  render: () => (
    <Tree
      data={sampleData}
      initialExpandedValues={["documents"]}
      initialSelectedValues={["documents/resume.pdf"]}
      disabled
    />
  ),
};

/** Demonstrates the component nested inside a non-default layer — the one case where an
 * explicit `<Layer>` wrap belongs in a story (see COMPONENT_STORYBOOK_GUIDE.md §9). */
export const LayerOne: StoryObj<typeof Tree> = {
  render: () => (
    <Layer layer={1} style={{ padding: "24px" }}>
      <Tree data={sampleData} initialExpandedValues={["documents"]} />
    </Layer>
  ),
};
