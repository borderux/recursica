import ReactMarkdown from "react-markdown";
import { TypographyStylesProvider } from "@mantine/core";
import {
  Container,
  Card,
  Title,
  Text as RawText,
  Group,
  Stack,
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
      <Card>
        <Card.Content>
          <TypographyStylesProvider>
            <ReactMarkdown>{overStylingDoc}</ReactMarkdown>
          </TypographyStylesProvider>

          <Stack
            style={{ height: 1, backgroundColor: "#eaeaea" }}
            my="rec-xl"
          />

          <Title order={3} mb="rec-md">
            Try It Yourself
          </Title>

          <Group mb="rec-xl">
            <Switch
              label="Highlight Over-Styled Components"
              checked={isHighlightActive}
              onChange={() => toggleGlobalOverStyled()}
            />
          </Group>

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
                overStyled
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
