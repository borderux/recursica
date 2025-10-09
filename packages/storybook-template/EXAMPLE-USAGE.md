# Using Recursica Bundle with Storybook Context

## Before (Global Window Variable - Not Recommended)

```tsx
import { getRecursicaBundle } from "@recursica/storybook-template";

const MyComponent = () => {
  try {
    const bundle = getRecursicaBundle(); // Accesses window.__RECURSICA_BUNDLE__
    const tokens = Object.values(bundle.tokens);
    // ... component logic
  } catch (error) {
    return <div>Bundle not found</div>;
  }
};
```

## After (React Context - Recommended)

```tsx
import { useRecursicaBundle } from "@recursica/storybook-template";

const MyComponent = () => {
  const { bundle } = useRecursicaBundle(); // Clean context access
  const tokens = Object.values(bundle.tokens);
  // ... component logic
};
```

## Benefits of Context Approach

1. **Type Safety**: Proper TypeScript support with context typing
2. **React Patterns**: Uses standard React context patterns
3. **No Global Pollution**: Doesn't pollute the global window object
4. **Better Error Handling**: Context provides clear error messages
5. **Testability**: Easier to mock and test with context providers
6. **Storybook Integration**: Works seamlessly with Storybook's decorator system

## Setup

The context is automatically set up when you pass `recursicaBundle` to `createPreviewConfig`:

```tsx
import { createPreviewConfig } from "@recursica/storybook-template";
import recursicaBundle from "./path/to/recursica-bundle.json";

export default createPreviewConfig({
  recursicaBundle, // This automatically sets up the context
  // ... other options
});
```

The context provider is automatically added as a decorator, making the bundle available to all stories.
