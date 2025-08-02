# KEY FINDINGS

## UI Kit Mantine Package Structure

### Component Organization
- Components are located in `packages/ui-kit-mantine/src/components/`
- Each component has its own directory with:
  - Component.tsx (main component file)
  - Component.css.ts (Vanilla Extract styles)
  - Component.stories.tsx (Storybook stories)
  - index.ts (export file)

### Important Notes About Exports
- **Only components exported in `src/components/index.ts` are available for use**
- Some components exist in the codebase but are NOT exported:
  - Text component (exists in src/components/Text/)
  - Loader component (exists in src/components/Loader/)
  - Title component (does not exist separately)

### Available Components (as of December 2024)
- **Layout**: Box, Flex, ThemeProvider
- **Form Controls**: Button, Textfield, Checkbox, Dropdown, Chip, Radio, Datepicker
- **Navigation**: Tabs, Anchor, Breadcrumb, Pagination
- **Typography**: Typography
- **Feedback**: Accordion, Tooltip
- **Media**: Logo, Icon
- **Data Display**: Avatar, Badge

### Design System Integration
- Uses Recursica design tokens via `import { recursica } from "../../recursica/Recursica"`
- Typography utilities available via `import { typographies } from "../Typography"`
- Styling primarily done with Vanilla Extract CSS (`.css.ts` files)

### Project Structure
- This is a Turborepo monorepo
- UI Kit Mantine is a package within the monorepo at `packages/ui-kit-mantine/`
- Uses Mantine 8+ as a peer dependency
- Built with Vite and documented with Storybook