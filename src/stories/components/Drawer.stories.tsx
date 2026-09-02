// Bottom sheet used for ConfirmSheet — the lightweight "are you sure?"
// moment for each shipment stage advance. Theme default: radius="lg",
// shadow="xl", content capped to the app's own 768px column.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Drawer, Group, Text } from "@mantine/core";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  argTypes: {
    position: { control: "select", options: ["bottom", "top", "left", "right"] },
  },
};
export default meta;

type Story = StoryObj<typeof Drawer>;

function PlaygroundRender() {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <Button variant="default" onClick={() => setOpened(true)}>Open</Button>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        withCloseButton={false}
        styles={{ content: { height: "auto", maxHeight: "85vh" } }}
      >
        <Text fw={700} size="lg" mb="md">Start delivery HC-4821?</Text>
        <Group grow>
          <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
          <Button onClick={() => setOpened(false)}>Start</Button>
        </Group>
      </Drawer>
    </>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "ConfirmSheet content (gallery)",
  render: () => <PlaygroundRender />,
};
