# UI Kit Library Usage

This package is now configured as a Vite library that can be consumed by other packages in the monorepo.

## Installation

Since this is part of a monorepo, you can install it in other packages using:

```bash
npm install ui-kit-mantine
# or if using workspaces
npm install ui-kit-mantine@workspace:*
```

## Usage

### Importing Components

```tsx
import { Button, Header, Page } from "ui-kit-mantine";
import type { ButtonProps, HeaderProps } from "ui-kit-mantine";
```

### Importing Styles

```tsx
// Import the bundled CSS styles
import "ui-kit-mantine/dist/ui-kit-mantine.css";
```

### Example Usage

```tsx
import React from "react";
import { Button, Header } from "ui-kit-mantine";
import "ui-kit-mantine/dist/ui-kit-mantine.css";

function App() {
  return (
    <div>
      <Header
        user={{ name: "John Doe" }}
        onLogin={() => console.log("Login")}
        onLogout={() => console.log("Logout")}
        onCreateAccount={() => console.log("Create Account")}
      />
      <Button
        primary
        size="large"
        label="Click Me"
        onClick={() => alert("Button clicked!")}
      />
    </div>
  );
}
```

## Available Components

- **Button**: Primary UI component for user interaction
- **Header**: Navigation header with authentication state
- **Page**: Complete page layout example

## Build Commands

- `npm run build:lib`: Build the library for distribution
- `npm run dev`: Development mode
- `npm run storybook`: Run Storybook for component documentation
