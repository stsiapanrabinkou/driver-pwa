// Every shipment stage StatusBadge can render, plus the "Delayed" flag shown
// alongside a stage. One controllable story (Controls panel) + a fixed
// gallery story for a side-by-side scan of every stage at once.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Table } from "@mantine/core";
import { StatusBadge } from "./StatusBadge";
import { STAGE_META, type ShipmentStage } from "./shipmentStage";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  argTypes: {
    stage: { control: "select", options: Object.keys(STAGE_META) },
  },
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Playground: Story = {
  args: { stage: "in_transit", isDelayed: false },
};

const ALL_STAGES = Object.keys(STAGE_META) as ShipmentStage[];

export const AllStages: Story = {
  name: "All stages (gallery)",
  render: () => (
    <Table withRowBorders={false} verticalSpacing="sm">
      <Table.Tbody>
        {ALL_STAGES.map((stage) => (
          <Table.Tr key={stage}>
            <Table.Td>{stage}</Table.Td>
            <Table.Td>
              <Stack gap={4}>
                <StatusBadge stage={stage} isDelayed={false} />
                <StatusBadge stage={stage} isDelayed />
              </Stack>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  ),
};
