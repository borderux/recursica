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
