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
      <Table.Row key={element.name}>
        <Table.Cell>{element.position}</Table.Cell>
        <Table.Cell>{element.name}</Table.Cell>
        <Table.Cell>{element.symbol}</Table.Cell>
        <Table.Cell>{element.mass}</Table.Cell>
      </Table.Row>
    ));

    return (
      <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Element position</Table.Cell>
              <Table.Cell>Element name</Table.Cell>
              <Table.Cell>Symbol</Table.Cell>
              <Table.Cell>Atomic mass</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </Table.Container>
    );
  },
};

export const SortedColumn: Story = {
  render: () => {
    const sorted = [...elements].sort((a, b) => a.mass - b.mass);
    const rows = sorted.map((element) => (
      <Table.Row key={element.name}>
        <Table.Cell>{element.position}</Table.Cell>
        <Table.Cell>{element.name}</Table.Cell>
        <Table.Cell>{element.symbol}</Table.Cell>
        <Table.Cell>{element.mass}</Table.Cell>
      </Table.Row>
    ));

    return (
      <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Element position</Table.Cell>
              <Table.Cell>Element name</Table.Cell>
              <Table.Cell>Symbol</Table.Cell>
              <Table.Cell sorted="asc">
                <Table.SortLabel active direction="asc">
                  Atomic mass
                </Table.SortLabel>
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </Table.Container>
    );
  },
};

export const SelectedAndDisabledRows: Story = {
  render: () => (
    <Table.Container>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Element position</Table.Cell>
            <Table.Cell>Element name</Table.Cell>
            <Table.Cell>Symbol</Table.Cell>
            <Table.Cell>Atomic mass</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {elements.map((element, index) => (
            <Table.Row
              key={element.name}
              selected={index === 0}
              disabled={index === elements.length - 1}
            >
              <Table.Cell>{element.position}</Table.Cell>
              <Table.Cell>{element.name}</Table.Cell>
              <Table.Cell>{element.symbol}</Table.Cell>
              <Table.Cell>{element.mass}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
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
      <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Item</Table.Cell>
              <Table.Cell variant="currency">Price</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {prices.map((row) => (
              <Table.Row key={row.item}>
                <Table.Cell>{row.item}</Table.Cell>
                <Table.Cell variant="currency">
                  ${row.price.toFixed(2)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>Total</Table.Cell>
              <Table.Cell variant="currency">${total.toFixed(2)}</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Table.Container>
    );
  },
};
