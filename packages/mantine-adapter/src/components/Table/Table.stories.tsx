import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "UI-Kit/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Table>;

const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 8, mass: 15.999, symbol: "O", name: "Oxygen" },
  { position: 9, mass: 18.998, symbol: "F", name: "Fluorine" },
  { position: 10, mass: 20.18, symbol: "Ne", name: "Neon" },
];

export const Default: Story = {
  render: () => {
    const rows = elements.map((element) => (
      <Table.Tr key={element.name}>
        <Table.Td>{element.position}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.symbol}</Table.Td>
        <Table.Td>{element.mass}</Table.Td>
      </Table.Tr>
    ));

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Element position</Table.Th>
            <Table.Th>Element name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Atomic mass</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );
  },
};

export const SortedColumn: Story = {
  render: () => {
    const sorted = [...elements].sort((a, b) => a.mass - b.mass);
    const rows = sorted.map((element) => (
      <Table.Tr key={element.name}>
        <Table.Td>{element.position}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.symbol}</Table.Td>
        <Table.Td>{element.mass}</Table.Td>
      </Table.Tr>
    ));

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Element position</Table.Th>
            <Table.Th>Element name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th sorted="asc">Atomic mass</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );
  },
};

export const SelectedAndDisabledRows: Story = {
  render: () => (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Element position</Table.Th>
          <Table.Th>Element name</Table.Th>
          <Table.Th>Symbol</Table.Th>
          <Table.Th>Atomic mass</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {elements.map((element, index) => (
          <Table.Tr
            key={element.name}
            selected={index === 0}
            disabled={index === elements.length - 1}
          >
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  ),
};

export const CurrencyColumnWithFooter: Story = {
  render: () => {
    const prices = [
      { item: "Widget", price: 19.99 },
      { item: "Gadget", price: 49.5 },
      { item: "Gizmo", price: 9.25 },
    ];
    const total = prices.reduce((sum, row) => sum + row.price, 0);

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th variant="currency">Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {prices.map((row) => (
            <Table.Tr key={row.item}>
              <Table.Td>{row.item}</Table.Td>
              <Table.Td variant="currency">${row.price.toFixed(2)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td>Total</Table.Td>
            <Table.Td variant="currency">${total.toFixed(2)}</Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    );
  },
};
