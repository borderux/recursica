import { Container, Card, Title, Text, Group, Stack } from "./components";
import { Button } from "./components/Button/Button";

export const OverStylingInfo = () => {
  return (
    <Container size="md" style={{ padding: "32px 0" }}>
      <Card>
        <Card.Content>
          <Title order={1} mb="rec-md">
            Over Styling (<code>overStyled</code>)
          </Title>
          <Text mb="rec-md">
            By default, all Recursica components are strictly sandboxed. This
            means they are protected against arbitrary styling configurations
            (like passing generic React <code>style</code> objects, custom{" "}
            <code>classNames</code> injections, or using deep Mantine layout
            hooks like <code>bg</code> and <code>c</code>). This strict
            compile-time and run-time enforcement guarantees that your design
            system tokens remain true across your application.
          </Text>
          <Text mb="rec-md">
            However, there may be edge cases where a developer absolutely must
            modify a component beyond what the design tokens natively allow. For
            this, we provide the <strong>escape hatch</strong> property:{" "}
            <code>overStyled={`{true}`}</code>.
          </Text>

          <Title order={3} mb="rec-sm">
            The Core Philosophy
          </Title>
          <Text mb="rec-sm">
            **You should not over-style components.** Using{" "}
            <code>overStyled</code> explicitly signifies that you are breaking
            design system rules.
          </Text>
          <Stack
            component="ol"
            style={{ paddingLeft: "24px" }}
            mb="rec-xl"
            gap="rec-sm"
          >
            <li>
              <Text>
                <strong>Technical Debt:</strong> If over-styling is required, it
                should be treated as a short-term workaround. Ideally, the
                component will be refactored once the required layouts or
                variants are officially integrated into the core Recursica
                component library.
              </Text>
            </li>
            <li>
              <Text>
                <strong>Auditing & Searching:</strong> Because this pattern
                creates technical debt, we enforce the explicit{" "}
                <code>overStyled</code> boolean. This provides a highly
                auditable, easily searchable string. Product managers and
                engineers can quickly grep the codebase for{" "}
                <code>overStyled</code> (or the <code>RecursicaOverStyled</code>{" "}
                typings) to hunt down components that don't match standard
                patterns.
              </Text>
            </li>
            <li>
              <Text>
                <strong>Highly Custom Components:</strong> If your application
                genuinely requires massive custom layouts that the UI kit cannot
                support, <strong>do not hack the Recursica component</strong>.
                Instead, it is highly encouraged that you import the underlying
                primitive component directly from <code>@mantine/core</code> and
                construct your independent feature there. While you can utilize
                raw Recursica CSS variables on these custom components, note
                that they are not guaranteed to be accurately maintained as
                Recursica evolves. Keep strict components strict!
              </Text>
            </li>
          </Stack>

          <Stack
            style={{ height: 1, backgroundColor: "#eaeaea" }}
            mb="rec-xl"
          />

          <Title order={3} mb="rec-sm">
            Permitted Layout Properties
          </Title>
          <Text mb="rec-sm">
            Unlike deep styling bounds (colors, typography, padding,
            dimensions), external <strong>layout spacing properties</strong>{" "}
            like Margins (<code>m</code>, <code>mt</code>, <code>mb</code>,{" "}
            <code>mx</code>) are safely <strong>permitted by default</strong>.
            This allows integrators to structurally compose components alongside
            siblings without breaching internal token boundaries.
          </Text>
          <Text mb="rec-xl">
            When using layout properties, you have the flexibility to use either
            ecosystem seamlessly:
          </Text>
          <Stack
            component="ol"
            style={{ paddingLeft: "24px" }}
            mb="rec-md"
            gap="rec-sm"
          >
            <li>
              <Text>
                <strong>Mantine Core Values:</strong> Passing standard Mantine
                sizes (like <code>mt="md"</code>) passes straight through to
                Mantine natively, allowing you to interface completely normally
                with a parent application's existing Mantine Theme setup that
                might fall outside Recursica's scope.
              </Text>
            </li>
            <li>
              <Text>
                <strong>Recursica Strict Tokens:</strong> Passing our custom
                prefixed tokens (like <code>mt="rec-md"</code>) signals our
                internal layout interceptor to securely translate the value
                directly to our native <code>recursica_brand_dimensions</code>{" "}
                CSS variables. This ensures strict design token measurements
                while sharing the exact same prop interface!
              </Text>
            </li>
          </Stack>
          <Text mb="rec-sm" overStyled fw={500}>
            Available Recursica Layout Tokens:
          </Text>
          <Stack
            component="ul"
            style={{ paddingLeft: "24px" }}
            mb="rec-xl"
            gap="rec-none"
          >
            <li>
              <Text>
                <code>rec-none</code> (0px limit)
              </Text>
            </li>
            <li>
              <Text>
                <code>rec-sm</code> (0.5x scaling)
              </Text>
            </li>
            <li>
              <Text>
                <code>rec-default</code> (1.0x scaling)
              </Text>
            </li>
            <li>
              <Text>
                <code>rec-md</code> (1.5x scaling)
              </Text>
            </li>
            <li>
              <Text>
                <code>rec-lg</code> (2.0x scaling)
              </Text>
            </li>
            <li>
              <Text>
                <code>rec-xl</code> (3.0x scaling)
              </Text>
            </li>
            <li>
              <Text>
                <code>rec-2xl</code> (4.0x scaling)
              </Text>
            </li>
          </Stack>

          <Stack
            style={{ height: 1, backgroundColor: "#eaeaea" }}
            mb="rec-xl"
          />

          <Title order={3} mb="rec-sm">
            Primitive Layout Components Exemption
          </Title>
          <Text mb="rec-sm">
            Unlike complex UI components (Buttons, Tabs, Inputs) which are
            strictly protected, <strong>Primitive Layout Components</strong> (
            <code>Flex</code>, <code>Stack</code>, <code>Group</code>,{" "}
            <code>Container</code>) are entirely exempt from the{" "}
            <code>RecursicaOverStyled</code> gatekeeper.
          </Text>
          <Text mb="rec-xl">
            Because the entire functional purpose of these components is
            structural layout composition, developers are free to pass any
            standard Mantine width, height, padding, margin, gap, and alignment
            property directly to them without needing to flag{" "}
            <code>overStyled={`{true}`}</code>. The internal custom token mapper
            (such as converting <code>gap="rec-md"</code>) is still active
            natively on these wrappers.
          </Text>

          <Stack
            style={{ height: 1, backgroundColor: "#eaeaea" }}
            mb="rec-xl"
          />

          <Title order={3} mb="rec-md">
            Live Example
          </Title>
          <Text mb="rec-xl">
            Below is a side-by-side comparison. The first is a standard
            Recursica Button protected by the design tokens mapping. The second
            flagrantly forces <code>overStyled={`{true}`}</code>, allowing
            Mantine's native styling generics to punch right through the sandbox
            layout.
          </Text>

          <Group gap="rec-xl">
            <Stack gap="rec-sm">
              <Text overStyled size="sm" c="dimmed">
                Strict Baseline (Default)
              </Text>
              <Button variant="solid">Standard UI Kit Button</Button>
            </Stack>
            <Stack gap="rec-sm">
              <Text overStyled size="sm" c="dimmed">
                overStyled={`{true}`}
              </Text>
              <Button overStyled={true} bg="pink" c="black" radius="xl">
                Unsafe Pink Marketing Button
              </Button>
            </Stack>
          </Group>
        </Card.Content>
      </Card>
    </Container>
  );
};
