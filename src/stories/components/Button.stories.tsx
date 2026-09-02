// Theme defaults: size="lg" (~50px, pinned to 48 via styles.root), variant
// "gradient" (signal.5 → signal.7), radius "xl" (clamps to a true pill).
// Secondary/utility buttons opt into an explicit variant instead.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["gradient", "filled", "light", "outline", "subtle", "default", "white"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: { children: "Confirm Delivery" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "In-app usages (gallery)",
  render: () => (
    <Group gap="md" wrap="wrap">
      <Button>Primary (gradient, default)</Button>
      <Button variant="default">Cancel (secondary)</Button>
      <Button leftSection={<IconPlus size={18} />}>With icon</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </Group>
  ),
};
