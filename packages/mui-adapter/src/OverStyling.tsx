import ReactMarkdown from "react-markdown";
import { Paper, Divider } from "@mui/material";
import {
  Container,
  Stack,
  Box,
  Text as RawText,
  Title,
  Switch as RawSwitch,
} from "./components";
import { Button as RawButton } from "./components/Button/Button";
import {
  useGlobalOverStyled,
  toggleGlobalOverStyled,
  wrapComponent,
} from "@recursica/adapter-common";
import overStylingDoc from "../OVERSTYLING.md?raw";

const Button = wrapComponent(RawButton);
const Text = wrapComponent(RawText);
const Switch = wrapComponent(RawSwitch);

export const OverStylingInfo = () => {
  const isHighlightActive = useGlobalOverStyled();
  return (
    <Container size="md" style={{ padding: "32px 0" }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Box className="markdown-body">
          <ReactMarkdown>{overStylingDoc}</ReactMarkdown>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Title order={6} mb={2}>
          Try It Yourself
        </Title>

        <Stack direction="row" alignItems="center" gap="rec-sm" mb="rec-md">
          <Switch
            label="Highlight Over-Styled Components"
            checked={isHighlightActive}
            onChange={() => toggleGlobalOverStyled()}
          />
        </Stack>

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
