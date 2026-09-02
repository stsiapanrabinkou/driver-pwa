// Eases the "Document name" field in once a file is picked (Add Document,
// Complete Delivery) instead of the layout jumping. Note the API: this
// component's prop is `expanded`, not `in` — an easy trap coming from older
// Mantine versions.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Collapse, Stack, Text, TextInput } from "@mantine/core";

const meta: Meta<typeof Collapse> = {
  title: "Components/Collapse",
  component: Collapse,
};
export default meta;

type Story = StoryObj<typeof Collapse>;

function PlaygroundRender() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Stack gap="sm" w={320}>
      <Button variant="default" onClick={() => setExpanded((v) => !v)}>
        Toggle
      </Button>
      <Collapse expanded={expanded}>
        <Stack gap="xs">
          <Text fw={700}>Document name</Text>
          <TextInput defaultValue="pod_scan_04" />
        </Stack>
      </Collapse>
    </Stack>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "Collapsed vs expanded (gallery)",
  render: () => (
    <Stack gap="xl" w={320}>
      <Stack gap={4}>
        <Text size="sm" c="dimmed">expanded=false</Text>
        <Collapse expanded={false}>
          <TextInput defaultValue="pod_scan_04" />
        </Collapse>
      </Stack>
      <Stack gap={4}>
        <Text size="sm" c="dimmed">expanded=true</Text>
        <Collapse expanded>
          <TextInput defaultValue="pod_scan_04" />
        </Collapse>
      </Stack>
    </Stack>
  ),
};
