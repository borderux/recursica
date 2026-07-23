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
