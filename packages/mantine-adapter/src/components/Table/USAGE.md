# Table - Usage Guide

This document describes how to integrate and use the `Table` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Table } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from 'react';
import { Table } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Tr>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Jane Doe</Table.Tr>
          <Table.Td>jane@example.com</Table.Tr>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
```

---

## 3. Row and Cell States

- **`Table.Tr`**: `selected` applies the selected-row background; `disabled` dims the row and applies the disabled cell colors to every cell in it.
- **`Table.Th`**: `sorted="asc" | "desc"` applies the sorted header style and renders the matching chevron icon; omit it (or pass `false`) for the unsorted style. `disabled` dims the header cell.
- **`Table.Td`**: `variant="currency"` applies the currency text style (for numeric/monetary columns); `disabled` dims the cell.

```tsx
<Table>
  <Table.Thead>
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th sorted="asc">Balance</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    <Table.Tr selected>
      <Table.Td>Jane Doe</Table.Td>
      <Table.Td variant="currency">$1,204.50</Table.Td>
    </Table.Tr>
    <Table.Tr disabled>
      <Table.Td>Inactive Account</Table.Td>
      <Table.Td variant="currency">$0.00</Table.Td>
    </Table.Tr>
  </Table.Tbody>
  <Table.Tfoot>
    <Table.Tr>
      <Table.Td>Total</Table.Td>
      <Table.Td variant="currency">$1,204.50</Table.Td>
    </Table.Tr>
  </Table.Tfoot>
</Table>
```

---
