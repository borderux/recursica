import ReactMarkdown from "react-markdown";
import {
  Container,
  Paper,
  Title,
  TypographyStylesProvider,
  Group,
  Anchor,
  Divider,
} from "@mantine/core";
import pkg from "../package.json";
import changelog from "../CHANGELOG.md?raw";

export const VersionInfo = () => {
  return (
    <Container size="md" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Title order={1} mb="xs">
          Mantine Adapter v{pkg.version}
        </Title>
        <Group mb="xl" gap="md">
          <Anchor
            href="https://github.com/borderux/recursica"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </Anchor>
          <Anchor
            href="https://recursica.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation & Website
          </Anchor>
        </Group>
        <Divider mb="xl" />
        <TypographyStylesProvider>
          <ReactMarkdown>{changelog}</ReactMarkdown>
        </TypographyStylesProvider>
      </Paper>
    </Container>
  );
};
