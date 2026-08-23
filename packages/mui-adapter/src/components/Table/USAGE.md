# Table - Usage Guide

This document describes how to integrate and use the `Table` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Table } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Table } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Table.Container>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Email</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Jane Doe</Table.Cell>
            <Table.Cell>jane@example.com</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Table.Container>
  );
}
```

---

## 3. Row and Cell States

- **`Table.Row`**: `selected` applies the selected-row background (and MUI's own `selected`/`aria-selected`); `disabled` dims the row and applies the disabled cell colors to every cell in it.
- **`Table.Cell`**: `sorted="asc" | "desc"` applies the sorted header style (pair with `Table.SortLabel` for the actual sort icon — see below); `variant="currency"` applies the currency text style; `disabled` dims the cell.
- **`Table.SortLabel`** (wraps MUI's `TableSortLabel`): renders the actual sort arrow. Compose it inside a `Table.Cell` the same way MUI's own docs do.

```tsx
<Table.Head>
  <Table.Row>
    <Table.Cell>Name</Table.Cell>
    <Table.Cell sorted="asc">
      <Table.SortLabel active direction="asc">
        Balance
      </Table.SortLabel>
    </Table.Cell>
  </Table.Row>
</Table.Head>
<Table.Body>
  <Table.Row selected>
    <Table.Cell>Jane Doe</Table.Cell>
    <Table.Cell variant="currency">$1,204.50</Table.Cell>
  </Table.Row>
  <Table.Row disabled>
    <Table.Cell>Inactive Account</Table.Cell>
    <Table.Cell variant="currency">$0.00</Table.Cell>
  </Table.Row>
</Table.Body>
<Table.Footer>
  <Table.Row>
    <Table.Cell>Total</Table.Cell>
    <Table.Cell variant="currency">$1,204.50</Table.Cell>
  </Table.Row>
</Table.Footer>
```

---

## 4. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.
