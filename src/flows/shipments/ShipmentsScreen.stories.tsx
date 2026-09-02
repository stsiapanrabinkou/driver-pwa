// Shipments — fully self-contained (search, date range, Today/Upcoming/
// Archived tabs, Delayed toggle all live as internal state), so there's
// nothing to drive via Storybook Controls: the controls ARE the screen —
// click the tabs, type in search, toggle Delayed, right in the canvas.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@mantine/core";
import { ShipmentsScreen } from "./ShipmentsScreen";

function PhoneViewport({ children }: { children: React.ReactNode }) {
  return (
    <Box style={{ maxWidth: 480, height: 900, margin: "0 auto", overflow: "auto" }}>
      {children}
    </Box>
  );
}

const meta: Meta<typeof ShipmentsScreen> = {
  title: "Screens/Shipments",
  component: ShipmentsScreen,
  decorators: [(Story) => <PhoneViewport><Story /></PhoneViewport>],
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Default: StoryObj<typeof ShipmentsScreen> = {};
