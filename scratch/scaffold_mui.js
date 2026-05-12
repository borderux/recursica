import fs from "fs";
import path from "path";

const componentsDir =
  "/Users/mattmassey/work/recursica/packages/mui-adapter/src/components";

const dirs = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

dirs.forEach((componentName) => {
  const dirPath = path.join(componentsDir, componentName);

  // Delete all files in the directory
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    fs.unlinkSync(path.join(dirPath, file));
  });

  // Write ComponentName.tsx
  const tsxContent = `import React from "react";

export type ${componentName}Props = React.HTMLAttributes<HTMLDivElement>;

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return <div {...props}>${componentName}</div>;
};
`;
  fs.writeFileSync(path.join(dirPath, `${componentName}.tsx`), tsxContent);

  // Write ComponentName.stories.tsx
  const storiesContent = `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "./${componentName}";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof ${componentName}> = {
  title: "UI-Kit/🚧 ${componentName}",
  component: ${componentName},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  render: () => <ComingSoon componentName="${componentName}" />,
};
`;
  fs.writeFileSync(
    path.join(dirPath, `${componentName}.stories.tsx`),
    storiesContent,
  );

  // Write index.ts
  const indexContent = `export * from './${componentName}';\n`;
  fs.writeFileSync(path.join(dirPath, `index.ts`), indexContent);
});

console.log("All components replaced with placeholders.");
