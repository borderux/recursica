import type { Preview } from "@storybook/react-vite";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../recursica_variables_scoped.css";
import { RecursicaThemeProvider } from "../src/RecursicaThemeProvider/RecursicaThemeProvider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <RecursicaThemeProvider theme="light">
        <MantineProvider defaultColorScheme="auto">
          <Story />
        </MantineProvider>
      </RecursicaThemeProvider>
    ),
  ],
};

export default preview;
