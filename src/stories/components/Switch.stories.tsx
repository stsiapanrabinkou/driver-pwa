// The Shipments tab's "Delayed only" toggle. Theme default: size="md".
// Replaced an earlier Chip-based toggle — the unchecked Chip state read as
// an inert badge, not an obvious toggle.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Switch } from "@mantine/core";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    color: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { label: "Delayed only", color: "orange" },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

function AllVariantsRender() {
  const [checked, setChecked] = useState(false);
  return (
    <Group gap="xl">
      <Switch label="Off" color="orange" checked={false} onChange={() => {}} />
      <Switch label="On" color="orange" checked onChange={() => {}} />
      <Switch
        label="Interactive"
        color="orange"
        checked={checked}
        onChange={(e) => setChecked(e.currentTarget.checked)}
      />
    </Group>
  );
}

export const AllVariants: Story = {
  name: "Off / on / interactive (gallery)",
  render: () => <AllVariantsRender />,
};
