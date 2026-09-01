import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const preview: Preview = {
  decorators: [(Story) => (<ThemeProvider><Story/></ThemeProvider>)],
};
export default preview;
