import type { Meta } from "@storybook/react-vite";
import { AdaptersContent, MantineLogo } from "@recursica/storybook-template";
import { VersionInfo } from "./Version";
import { OverStylingInfo } from "./OverStyling";
import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Link,
  Button,
} from "./components";

const DOCS_URL = "https://recursica.com";
const FORGE_URL = "https://forge.recursica.com";

function IntroductionContent() {
  return (
    <Container size="md" style={{ padding: "32px 0", maxWidth: 640 }}>
      <Group gap="rec-md" mb="rec-xl" align="flex-start" wrap="nowrap">
        <MantineLogo width={80} height={80} />
        <Stack gap={0}>
          <Title order={1} m={0}>
            Recursica Design System (Mantine Adapter)
          </Title>
          <Link href="https://mantine.dev" target="_blank" rel="noreferrer">
            mantine.dev
          </Link>
        </Stack>
      </Group>
      <Text mb="rec-xl">
        This Storybook showcases the Recursica design system implemented for the{" "}
        <strong>Mantine UI Kit</strong>. It provides reusable components that
        map our design tokens to Mantine's robust component layer.
      </Text>

      <Stack mb="rec-xl">
        <Title order={2} mb="rec-md">
          Looking for another UI Kit?
        </Title>
        <Text mb="rec-md">
          Are you using a different UI Kit (like Material UI)? Recursica
          provides multiple adapters for different frameworks.
        </Text>
        <Group mt="rec-md">
          <Button
            component="a"
            href="./?path=/story/introduction--adapters"
            target="_parent"
            variant="solid"
          >
            View Supported Adapters
          </Button>
        </Group>
      </Stack>

      <Stack mb="rec-xl">
        <Title order={2} mb="rec-md">
          Installation
        </Title>
        <Text mb="rec-md">
          To install the Mantine adapter in your project, run:
        </Text>
        <Stack
          style={{
            padding: 12,
            backgroundColor: "#f5f5f5",
            borderRadius: 6,
            fontSize: 13,
            marginTop: 8,
          }}
        >
          <code>
            npm install @recursica/mantine-adapter @mantine/core @mantine/hooks
          </code>
        </Stack>
      </Stack>

      <Stack mb="rec-xl">
        <Title order={2} mb="rec-md">
          Tokens
        </Title>
        <Text mb="rec-md">
          Raw design tokens (colors, sizes, font weights, opacities, etc.) that
          feed the theme and components. These are the primitive values defined
          in your token set and exposed as CSS custom properties.
        </Text>
      </Stack>

      <Stack mb="rec-xl">
        <Title order={2} mb="rec-md">
          Theme
        </Title>
        <Text mb="rec-md">
          Brand and theme layer built on top of tokens. Typography types,
          dimensions, and layout grids are defined here. Theme uses the tokens
          and exposes both CSS variables and helper classes (e.g. typography
          classes) for consistent styling across the product.
        </Text>
      </Stack>

      <Stack mb="rec-xl">
        <Title order={2} mb="rec-md">
          Configuring Recursica
        </Title>
        <Text mb="rec-md">
          To modify the Recursica configuration (tokens, brand, theme), go to{" "}
          <Link href={FORGE_URL} target="_blank" rel="noopener noreferrer">
            {FORGE_URL}
          </Link>
          . Changes there drive the tokens and theme you see in this Storybook.
        </Text>
      </Stack>

      <Stack mb="rec-xl">
        <Title order={2} mb="rec-md">
          Documentation
        </Title>
        <Text mb="rec-md">
          For full documentation, guides, and API reference, visit{" "}
          <Link href={DOCS_URL} target="_blank" rel="noopener noreferrer">
            {DOCS_URL}
          </Link>
          .
        </Text>
      </Stack>
    </Container>
  );
}

const meta = {
  title: "Introduction",
} satisfies Meta;

export default meta;

export const Welcome = {
  render: () => <IntroductionContent />,
};

export const Adapters = {
  render: () => <AdaptersContent />,
};

export const OverStyling = {
  name: "Over Styling",
  render: () => <OverStylingInfo />,
};

export const VersionInfoStory = {
  name: "Version Info",
  render: () => <VersionInfo />,
};
