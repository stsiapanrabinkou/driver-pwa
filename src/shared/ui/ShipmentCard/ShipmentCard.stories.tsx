// ShipmentCard across the shipment lifecycle, plus the delayed variant. One
// controllable story + a fixed gallery of every stage stacked for scanning.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@mantine/core";
import { ShipmentCard } from "./ShipmentCard";
import { STAGE_META, type ShipmentStage } from "../StatusBadge/shipmentStage";

const meta: Meta<typeof ShipmentCard> = {
  title: "Components/ShipmentCard",
  component: ShipmentCard,
  argTypes: {
    stage: { control: "select", options: Object.keys(STAGE_META) },
  },
  args: {
    id: "HC-4821",
    from: "Av. Paseo de la Reforma 222, Ciudad de México, CDMX",
    to: "Av. Universidad 1858, Ciudad de México, CDMX",
    placedLabel: "Aug 12, 2026",
    dueLabel: "Today, 14:00",
  },
};
export default meta;

type Story = StoryObj<typeof ShipmentCard>;

export const Playground: Story = {
  args: { stage: "in_transit", isDelayed: false },
};

export const Delayed: Story = {
  args: { stage: "in_transit", isDelayed: true, dueColor: "yellow" },
};

const ALL_STAGES = Object.keys(STAGE_META) as ShipmentStage[];

export const AllStages: Story = {
  name: "All stages (gallery)",
  render: (args) => (
    <Stack gap="md" w={420}>
      {ALL_STAGES.map((stage) => (
        <ShipmentCard key={stage} {...args} stage={stage} />
      ))}
    </Stack>
  ),
};
