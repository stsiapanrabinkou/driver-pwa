// The subtle placeholder icon inside empty attach-file / PDF-page boxes
// (Document Viewer), and SyncStatusBar's status icon.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, ThemeIcon } from "@mantine/core";
import { IconFileText, IconPhoto } from "@tabler/icons-react";

const meta: Meta<typeof ThemeIcon> = {
  title: "Components/ThemeIcon",
  component: ThemeIcon,
  argTypes: {
    variant: { control: "select", options: ["filled", "light", "outline", "subtle", "gradient", "default"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", 64] },
  },
  args: {
    variant: "subtle",
    size: 64,
    radius: "md",
    children: <IconPhoto size={36} />,
  },
};
export default meta;

type Story = StoryObj<typeof ThemeIcon>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "Placeholder icons (gallery)",
  render: () => (
    <Group gap="md">
      <ThemeIcon variant="subtle" size={64} radius="md"><IconPhoto size={36} /></ThemeIcon>
      <ThemeIcon variant="subtle" size={64} radius="md"><IconFileText size={36} /></ThemeIcon>
    </Group>
  ),
};
