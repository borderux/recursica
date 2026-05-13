import { Paper, Divider } from "@mui/material";
import { Container, Stack, Box, Text, Title } from "./components";
import { Button } from "./components/Button/Button";

export const OverStylingInfo = () => {
  return (
    <Container size="md" style={{ padding: "32px 0" }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Title order={4} mb={2}>
          Over Styling (<code>overStyled</code>)
        </Title>
        <Text mb={2}>
          By default, all Recursica components are strictly sandboxed. This
          means they are protected against arbitrary styling configurations
          (like passing generic React <code>style</code> objects, custom{" "}
          <code>className</code> injections, or using deep MUI layout props like{" "}
          <code>sx</code>). This strict compile-time and run-time enforcement
          guarantees that your design system tokens remain true across your
          application.
        </Text>
        <Text mb={2}>
          However, there may be edge cases where a developer absolutely must
          modify a component beyond what the design tokens natively allow. For
          this, we provide the <strong>escape hatch</strong> property:{" "}
          <code>overStyled={`{true}`}</code>.
        </Text>

        <Title order={6} mb={1} mt={4}>
          The Core Philosophy
        </Title>
        <Text mb={1}>
          **You should not over-style components.** Using{" "}
          <code>overStyled</code> explicitly signifies that you are breaking
          design system rules.
        </Text>
        <Box component="ol" sx={{ pl: 4, mb: 4 }}>
          <li>
            <Text>
              <strong>Technical Debt:</strong> If over-styling is required, it
              should be treated as a short-term workaround. Ideally, the
              component will be refactored once the required layouts or variants
              are officially integrated into the core Recursica component
              library.
            </Text>
          </li>
          <li>
            <Text>
              <strong>Auditing & Searching:</strong> Because this pattern
              creates technical debt, we enforce the explicit{" "}
              <code>overStyled</code> boolean. This provides a highly auditable,
              easily searchable string. Product managers and engineers can
              quickly grep the codebase for <code>overStyled</code> (or the{" "}
              <code>RecursicaOverStyled</code> typings) to hunt down components
              that don't match standard patterns.
            </Text>
          </li>
          <li>
            <Text>
              <strong>Highly Custom Components:</strong> If your application
              genuinely requires massive custom layouts that the UI kit cannot
              support, <strong>do not hack the Recursica component</strong>.
              Instead, it is highly encouraged that you import the underlying
              primitive component directly from <code>@mui/material</code> and
              construct your independent feature there. While you can utilize
              raw Recursica CSS variables on these custom components, note that
              they are not guaranteed to be accurately maintained as Recursica
              evolves. Keep strict components strict!
            </Text>
          </li>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Title order={6} mb={1}>
          Permitted Layout Properties
        </Title>
        <Text mb={1}>
          Unlike deep styling bounds (colors, typography, padding, dimensions),
          external <strong>layout spacing properties</strong> like Margins (
          <code>m</code>, <code>mt</code>, <code>mb</code>, <code>mx</code>) are
          safely <strong>permitted by default</strong>. This allows integrators
          to structurally compose components alongside siblings without
          breaching internal token boundaries.
        </Text>
        <Text mb={3}>
          When using layout properties, you have the flexibility to use either
          ecosystem seamlessly:
        </Text>
        <Box component="ol" sx={{ pl: 4, mb: 2 }}>
          <li>
            <Text>
              <strong>MUI Core Values:</strong> Passing standard MUI sizes (like{" "}
              <code>mt={"{2}"}</code>) passes straight through to MUI natively,
              allowing you to interface completely normally with a parent
              application's existing MUI Theme setup that might fall outside
              Recursica's scope.
            </Text>
          </li>
          <li>
            <Text>
              <strong>Recursica Strict Tokens:</strong> Passing our custom
              prefixed tokens (like <code>mt="rec-md"</code>) signals our
              internal layout interceptor to securely translate the value
              directly to our native <code>--recursica_brand_dimensions_*</code>{" "}
              CSS variables. This ensures strict design token measurements while
              sharing the exact same prop interface!
            </Text>
          </li>
        </Box>
        <Text mb={1} overStyled sx={{ fontWeight: 500 }}>
          Available Recursica Layout Tokens:
        </Text>
        <Box component="ul" sx={{ pl: 4, mb: 4 }}>
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
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Title order={6} mb={1}>
          Primitive Layout Components Exemption
        </Title>
        <Text mb={1}>
          Unlike complex UI components (Buttons, Tabs, Inputs) which are
          strictly protected, <strong>Primitive Layout Components</strong> (
          <code>Flex</code>,<code>Stack</code>, <code>Group</code>,{" "}
          <code>Container</code>) are entirely exempt from the{" "}
          <code>RecursicaOverStyled</code> gatekeeper.
        </Text>
        <Text mb={4}>
          Because the entire functional purpose of these components is
          structural layout composition, developers are free to pass any
          standard MUI width, height, padding, margin, gap, and alignment
          property directly to them without needing to flag{" "}
          <code>overStyled={`{true}`}</code>. The internal custom token mapper
          (such as converting <code>gap="rec-md"</code>) is still active
          natively on these wrappers.
        </Text>

        <Divider sx={{ mb: 4 }} />

        <Title order={6} mb={2}>
          Live Example
        </Title>
        <Text mb={4}>
          Below is a side-by-side comparison. The first is a standard Recursica
          Button protected by the design tokens mapping. The second flagrantly
          forces <code>overStyled={`{true}`}</code>, allowing MUI's native
          styling generics to punch right through the sandbox layout.
        </Text>

        <Stack direction="row" gap="rec-default">
          <Box>
            <Text
              variant="caption"
              overStyled
              sx={{ color: "text.secondary", mb: 1, display: "block" }}
            >
              Strict Baseline (Default)
            </Text>
            <Button>Standard UI Kit Button</Button>
          </Box>
          <Box>
            <Text
              variant="caption"
              overStyled
              sx={{ color: "text.secondary", mb: 1, display: "block" }}
            >
              overStyled={`{true}`}
            </Text>
            <Button
              overStyled={true}
              style={{
                backgroundColor: "pink",
                color: "black",
                borderRadius: "24px",
                padding: "8px 16px",
              }}
            >
              Unsafe Pink Marketing Button
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};
