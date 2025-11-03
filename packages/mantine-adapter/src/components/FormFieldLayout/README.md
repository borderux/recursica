# FormFieldLayout

A generic wrapper component that applies consistent layout styles to Mantine form components.

## Usage

The FormFieldLayout component wraps any Mantine form component (TextInput, Select, Textarea, etc.) and applies consistent layout styling for labels, fields, descriptions, and error messages.

### Basic Example

```tsx
import { FormFieldLayout } from "./FormFieldLayout";
import { TextInput } from "@mantine/core";

<FormFieldLayout layout="stacked">
  <TextInput
    label="Email Address"
    description="Enter your email address"
    placeholder="Enter your email"
    required
  />
</FormFieldLayout>;
```

### Side-by-Side Layout

```tsx
<FormFieldLayout Layout="Side-by-side">
  <TextInput
    label="Full Name"
    description="Enter your first and last name"
    placeholder="Enter your full name"
    required
  />
</FormFieldLayout>
```

### With Error State

```tsx
<FormFieldLayout Layout="Stacked">
  <TextInput
    label="Password"
    description="Password must be at least 8 characters"
    error="Password is too short"
    type="password"
    placeholder="Enter password"
    required
  />
</FormFieldLayout>
```

### With Optional Indicator

```tsx
<FormFieldLayout Layout="Stacked">
  <TextInput
    label="Middle Name"
    description="This field is optional"
    placeholder="Enter middle name"
    classNames={{
      label: "optional", // Uses custom Label component with Indicator="optional"
    }}
  />
</FormFieldLayout>
```

## Props

| Prop       | Type                          | Default     | Description                        |
| ---------- | ----------------------------- | ----------- | ---------------------------------- |
| `children` | `ReactElement`                | -           | The Mantine form component to wrap |
| `Layout`   | `"Stacked" \| "Side-by-side"` | `"Stacked"` | Layout orientation                 |

## How It Works

The FormFieldLayout component:

1. Takes any Mantine form component as children
2. Injects layout styles directly into the component's `classNames.root` prop
3. **Stacked Layout**: Single column grid (`grid-template-columns: 1fr`)
4. **Side-by-Side Layout**: Two column grid with fixed 248px label area (`grid-template-columns: 248px 1fr`)
5. Uses design system tokens for proper spacing and gaps
6. Returns the modified Mantine component directly (no wrapper div)
7. Lets Mantine handle all the form component logic (labels, descriptions, errors)

This approach applies grid layout styles directly to Mantine's root element without adding any wrapper elements to the DOM.
