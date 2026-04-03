import type { Meta, StoryObj } from "@storybook/react";
import {
  Container,
  Paper,
  Title,
  Text,
  List,
  Divider,
  Group,
  Code,
} from "@mantine/core";
import { Button } from "./components/Button/Button";

const OverStylingInfo = () => {
  return (
    <Container size="md" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Title order={1} mb="md">
          Over Styling (<Code>overStyled</Code>)
        </Title>
        <Text mb="md">
          By default, all Recursica components are strictly sandboxed. This
          means they are protected against arbitrary styling configurations
          (like passing generic React <Code>style</Code> objects, custom{" "}
          <Code>classNames</Code> injections, or using deep Mantine layout hooks
          like <Code>bg</Code> and <Code>c</Code>). This strict compile-time and
          run-time enforcement guarantees that your design system tokens remain
          true across your application.
        </Text>
        <Text mb="md">
          However, there may be edge cases where a developer absolutely must
          modify a component beyond what the design tokens natively allow. For
          this, we provide the <strong>escape hatch</strong> property:{" "}
          <Code>overStyled={`{true}`}</Code>.
        </Text>

        <Title order={3} mb="sm">
          The Core Philosophy
        </Title>
        <Text mb="sm">
          **You should not over-style components.** Using{" "}
          <Code>overStyled</Code> explicitly signifies that you are breaking
          design system rules.
        </Text>
        <List mb="xl" type="ordered">
          <List.Item>
            <strong>Technical Debt:</strong> If over-styling is required, it
            should be treated as a short-term workaround. Ideally, the component
            will be refactored once the required layouts or variants are
            officially integrated into the core Recursica component library.
          </List.Item>
          <List.Item>
            <strong>Auditing & Searching:</strong> Because this pattern creates
            technical debt, we enforce the explicit <Code>overStyled</Code>{" "}
            boolean. This provides a highly auditable, easily searchable string.
            Product managers and engineers can quickly grep the codebase for{" "}
            <Code>overStyled</Code> (or the <Code>RecursicaOverStyled</Code>{" "}
            typings) to hunt down components that don't match standard patterns.
          </List.Item>
          <List.Item>
            <strong>Highly Custom Components:</strong> If your application
            genuinely requires massive custom layouts that the UI kit cannot
            support, <strong>do not hack the Recursica component</strong>.
            Instead, it is highly encouraged that you import the underlying
            primitive component directly from <Code>@mantine/core</Code> and
            construct your independent feature there. While you can utilize raw
            Recursica CSS variables on these custom components, note that they
            are not guaranteed to be accurately maintained as Recursica evolves.
            Keep strict components strict!
          </List.Item>
        </List>

        <Divider mb="xl" />

        <Title order={3} mb="md">
          Live Example
        </Title>
        <Text mb="xl">
          Below is a side-by-side comparison. The first is a standard Recursica
          Button protected by the design tokens mapping. The second flagrantly
          forces <Code>overStyled={`{true}`}</Code>, allowing Mantine's native
          styling generics to punch right through the sandbox layout.
        </Text>

        <Group gap="xl">
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Strict Baseline (Default)
            </Text>
            <Button variant="solid">Standard UI Kit Button</Button>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              overStyled={`{true}`}
            </Text>
            <Button overStyled={true} bg="pink" c="black" radius="xl">
              Unsafe Pink Marketing Button
            </Button>
          </div>
        </Group>
      </Paper>
    </Container>
  );
};

const meta: Meta<typeof OverStylingInfo> = {
  title: "Introduction/Over Styling",
  component: OverStylingInfo,
};

export default meta;

export const Default: StoryObj<typeof OverStylingInfo> = {};
