import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const preview: Preview = {
  decorators: [(Story) => (<ThemeProvider><Story/></ThemeProvider>)],
  parameters: {
    options: {
      // Top-level groups in this fixed order; everything inside each group
      // (and any group not listed) falls back to plain alphabetical.
      storySort: {
        method: "alphabetical",
        order: ["System", ["Colors", "Typography", "Theme Showcase", "Flow Map"], "Components", "Screens"],
        locales: "en-US",
      },
    },
  },
};
export default preview;
