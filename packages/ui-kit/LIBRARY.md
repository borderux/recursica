# UI Kit Library Usage

This package is now configured as a Vite library that can be consumed by other packages in the monorepo.

## Installation

Since this is part of a monorepo, you can install it in other packages using:

```bash
npm install ui-kit
# or if using workspaces
npm install ui-kit@workspace:*
```

## Usage

### Importing Components

```tsx
import { Button, Header, Page } from "ui-kit";
import type { ButtonProps, HeaderProps } from "ui-kit";
```

### Importing Styles

```tsx
// Import the bundled CSS styles
import "ui-kit/dist/ui-kit.css";
```

### Example Usage

```tsx
import React from "react";
import { Button, Header } from "ui-kit";
import "ui-kit/dist/ui-kit.css";

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
