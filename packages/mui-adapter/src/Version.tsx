import ReactMarkdown from "react-markdown";
import { Paper, Divider } from "@mui/material";
import { Container, Title, Group, Link, Box } from "./components";
import pkg from "../package.json";
import changelog from "../CHANGELOG.md?raw";

export const VersionInfo = () => {
  return (
    <Container size="md" style={{ padding: "32px 0" }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Title order={1} mb={1}>
          MUI Adapter v{pkg.version}
        </Title>
        <Group mb={4} gap="rec-md">
          <Link
            href="https://github.com/borderux/recursica"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </Link>
          <Link
            href="https://recursica.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation & Website
          </Link>
        </Group>
        <Divider sx={{ mb: 4 }} />
        <Box className="markdown-body">
          <ReactMarkdown>{changelog}</ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};
