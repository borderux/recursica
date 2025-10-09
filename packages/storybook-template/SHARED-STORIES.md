# Shared Stories

The `storybook-template` package includes common stories that can be used across all your Storybooks. These stories provide consistent documentation and token visualization.

## Available Stories

### Introduction Story

- **Location**: `stories/Introduction.stories.tsx`
- **Purpose**: Welcome page explaining your design system
- **Customization**: Update the content to match your design system branding

### Token Stories

- **Color**: `stories/Tokens/Color.stories.tsx` - Visual color palette
- **Grid**: `stories/Tokens/Grid.stories.tsx` - Grid layout patterns
- **Size**: `stories/Tokens/Size.stories.tsx` - Size tokens (spacers, gutters, border radius)

## Setup Instructions

### 1. Copy Stories to Your Storybook

Copy the stories from `storybook-template/stories/` to your Storybook's `stories/` directory:

```bash
# Copy all shared stories
cp -r packages/storybook-template/stories/* apps/your-storybook/stories/

# Or copy specific stories
cp packages/storybook-template/stories/Introduction.stories.tsx apps/your-storybook/stories/
cp -r packages/storybook-template/stories/Tokens apps/your-storybook/stories/
```

### 2. Initialize Recursica Stories

For token stories to work, you need to initialize the Recursica stories with your recursica bundle. Add this to your Storybook's preview configuration:

```typescript
// .storybook/preview.tsx
import { initializeRecursicaStories } from "@recursica/storybook-template";
import recursicaBundle from "../path/to/your/recursica-bundle.json";

// Initialize Recursica stories with your bundle
initializeRecursicaStories(recursicaBundle);

// ... rest of your preview config
```

### 3. Customize Stories

#### Introduction Story

Update the content in `Introduction.stories.tsx` to match your design system:

```typescript
// Replace generic content with your design system information
const WelcomeComponent = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Welcome to Your Design System</h1>
    {/* Add your custom content */}
  </div>
);
```

#### Token Stories

The token stories will automatically work once `initializeRecursicaStories()` is called. They will display your design tokens from the recursica bundle.

### 4. Update Storybook Configuration

Make sure your Storybook configuration includes the shared stories:

```typescript
// .storybook/main.ts
import { createMainConfig } from "@recursica/storybook-template";

const config = createMainConfig({
  stories: [
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Include shared stories
    "../stories/Introduction.stories.tsx",
    "../stories/Tokens/**/*.stories.tsx",
  ],
});

export default config;
```

## Dependencies

The shared stories require:

- `@recursica/storybook-template` - For shared stories and utilities
- `@recursica/schemas` - For type definitions
- Your recursica bundle JSON file

## Customization Examples

### Custom Introduction Content

```typescript
// stories/Introduction.stories.tsx
import React from "react";
import { Box, Typography } from "@your-ui-kit/package";

const WelcomeComponent = () => (
  <Box p="size/spacer/2x">
    <Typography variant="h1">Welcome to My Design System</Typography>
    <Typography variant="body-1/normal">
      This is my custom design system description...
    </Typography>
  </Box>
);
```

### Custom Token Story Layout

```typescript
// stories/Tokens/Color.stories.tsx
import React from "react";
import { Box, Flex, Typography } from "@your-ui-kit/package";
import { TokenManager } from "@recursica/storybook-template";

const ColorPalette = () => {
  const tokenManager = TokenManager.getInstance();
  const groupedColors = tokenManager.getGroupedColors();

  return (
    <Box p="size/spacer/2x">
      <Typography variant="h1">My Color Palette</Typography>
      {/* Custom layout using your UI kit components */}
    </Box>
  );
};
```

## Benefits

- **Consistency**: All Storybooks have the same token documentation
- **Maintainability**: Update stories in one place, use everywhere
- **Customization**: Easy to customize for each project's needs
- **Type Safety**: Full TypeScript support with proper types
- **Design Token Integration**: Automatic visualization of your design tokens

## Troubleshooting

### Recursica Stories Not Initialized Error

If you see "TokenManager not initialized" errors:

1. Make sure you've imported and called `initializeRecursicaStories()` in your preview config
2. Verify the path to your recursica bundle is correct
3. Check that your recursica bundle has the expected structure

### Stories Not Appearing

If stories don't appear in Storybook:

1. Check that the story files are in the correct location
2. Verify your `main.ts` configuration includes the story paths
3. Make sure the story files have the correct `.stories.tsx` extension
