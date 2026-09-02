// The three ways ActionIcon is actually used across the built screens: the
// round back button in every fullScreen modal/detail header, the "…" menu
// trigger (Document Viewer), and a subtle red delete/remove action (file
// attach cards). Theme default: size="lg" (bigControlSizes).

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft, IconDots, IconTrash } from "@tabler/icons-react";

const meta: Meta<typeof ActionIcon> = {
  title: "Components/ActionIcon",
  component: ActionIcon,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "filled", "light", "outline", "subtle", "transparent", "gradient"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", 48] },
    color: { control: "text" },
  },
  args: {
    variant: "default",
    size: 48,
    radius: "xl",
    bg: "dark.6",
    style: { border: "none" },
    children: <IconArrowLeft size={22} />,
  },
};
export default meta;

type Story = StoryObj<typeof ActionIcon>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "Header contexts (gallery)",
  render: () => (
    <Group gap="xl">
      <Stack align="center" gap={6}>
        <ActionIcon variant="default" size={48} radius="xl" bg="dark.6" style={{ border: "none" }}>
          <IconArrowLeft size={22} />
        </ActionIcon>
        <Text size="sm" c="dimmed">Back button</Text>
      </Stack>
      <Stack align="center" gap={6}>
        <ActionIcon variant="default" size={48} radius="xl" bg="dark.6" style={{ border: "none" }}>
          <IconDots size={22} />
        </ActionIcon>
        <Text size="sm" c="dimmed">Overflow menu trigger</Text>
      </Stack>
      <Stack align="center" gap={6}>
        <ActionIcon variant="subtle" color="red" radius="xl">
          <IconTrash size={18} />
        </ActionIcon>
        <Text size="sm" c="dimmed">Remove / delete</Text>
      </Stack>
    </Group>
  ),
};
