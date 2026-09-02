// Shown inside SyncStatusBar while a queued item is actively syncing
// (online + pending).

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Loader } from "@mantine/core";

const meta: Meta<typeof Loader> = {
  title: "Components/Loader",
  component: Loader,
  argTypes: {
    type: { control: "select", options: ["oval", "bars", "dots"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  args: { size: "sm" },
};
export default meta;

type Story = StoryObj<typeof Loader>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "Sizes (gallery)",
  render: () => (
    <Group gap="md" align="center">
      <Loader size="xs" />
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" />
    </Group>
  ),
};
