// Progress values across the shipment lifecycle (see STAGE_PROGRESS), plus
// the delayed color swap. One controllable story + a fixed gallery.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack } from "@mantine/core";
import { ShipmentProgressBar } from "./ShipmentProgressBar";
import { STAGE_PROGRESS } from "../StatusBadge/shipmentStage";

const meta: Meta<typeof ShipmentProgressBar> = {
  title: "Components/ShipmentProgressBar",
  component: ShipmentProgressBar,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    color: { control: "select", options: ["signal", "orange"] },
  },
};
export default meta;

type Story = StoryObj<typeof ShipmentProgressBar>;

export const Playground: Story = {
  args: { value: 60, color: "signal" },
};

export const AllStages: Story = {
  name: "All stages (gallery)",
  render: () => (
    <Stack gap="md" w={360}>
      {Object.entries(STAGE_PROGRESS).map(([stage, value]) => (
        <Box key={stage}>
          <ShipmentProgressBar value={value} />
        </Box>
      ))}
    </Stack>
  ),
};

export const Delayed: Story = {
  name: "Delayed color",
  args: { value: 45, color: "orange" },
};
