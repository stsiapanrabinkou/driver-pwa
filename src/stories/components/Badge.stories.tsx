// Raw Badge — stage-colored usage lives in its own dedicated component,
// Components/StatusBadge. This page covers the other two spots the plain
// Mantine Badge shows up: a circular alert count, and generic status pills.
// Theme default: radius="xl", size="lg".

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Group } from "@mantine/core";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: { control: "select", options: ["filled", "light", "outline", "dot", "gradient", "transparent", "white"] },
    color: { control: "text" },
    circle: { control: "boolean" },
  },
  args: { children: "5", color: "signal", circle: true },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "In-app usages (gallery)",
  render: () => (
    <Group gap="md" align="center">
      <Badge circle color="signal">5</Badge>
      <Badge variant="filled" color="green">DELIVERED</Badge>
      <Badge variant="filled" color="blue">IN TRANSIT</Badge>
      <Badge variant="filled" color="orange">DELAYED</Badge>
      <Badge variant="filled" color="red">RETURNED</Badge>
      <Badge variant="filled" color="gray">PLANNED</Badge>
    </Group>
  ),
};
