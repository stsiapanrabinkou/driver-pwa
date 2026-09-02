// Theme default: withBorder=false, shadow="sm", radius="xl", bg="dark.6" —
// one shared "tile" surface for every Card in the app. What actually
// differs screen to screen is the border, used as a state indicator
// (selected outcome, attach-file dashed→solid, valid/invalid). This page
// catalogs every recurring card *pattern* built on top of that shared
// tile, not just the bare component.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconCircleCheckFilled, IconPaperclip, IconSignature } from "@tabler/icons-react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    padding: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  args: {
    padding: "lg",
    children: <Text fw={600}>Card content</Text>,
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Playground: Story = {};

export const AllPatterns: Story = {
  name: "Recurring card patterns (gallery)",
  render: () => (
    <SimpleGrid cols={2} spacing="lg" w={520}>
      <Stack gap={4}>
        <Text size="sm" c="dimmed">Plain tile (theme default)</Text>
        <Card padding="md"><Text fw={600}>Default surface</Text></Card>
      </Stack>

      <Stack gap={4}>
        <Text size="sm" c="dimmed">Selected (2px signal border)</Text>
        <Card padding="md" style={{ border: "2px solid var(--mantine-color-signal-6)" }}>
          <Stack align="center" gap={6}>
            <IconCircleCheckFilled size={26} color="var(--mantine-color-green-6)" />
            <Text fw={700}>Delivered</Text>
          </Stack>
        </Card>
      </Stack>

      <Stack gap={4}>
        <Text size="sm" c="dimmed">Attach — empty (dashed)</Text>
        <Card padding="md" h={88} style={{ border: "2px dashed var(--mantine-color-signal-4)", cursor: "pointer" }}>
          <Stack align="center" justify="center" gap={6} h="100%">
            <IconPaperclip size={18} color="var(--mantine-color-signal-6)" />
            <Text fw={600} c="signal">Take photo or choose file</Text>
          </Stack>
        </Card>
      </Stack>

      <Stack gap={4}>
        <Text size="sm" c="dimmed">Attach — filled (solid)</Text>
        <Card padding="md" h={88} style={{ border: "1px solid var(--mantine-color-dark-4)" }}>
          <Group justify="space-between" h="100%" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <IconPaperclip size={20} color="var(--mantine-color-green-6)" />
              <Stack gap={0}>
                <Text fw={600}>pod_scan_04</Text>
                <Text size="sm" c="dimmed">JPG · 293 KB</Text>
              </Stack>
            </Group>
          </Group>
        </Card>
      </Stack>

      <Stack gap={4}>
        <Text size="sm" c="dimmed">Toggleable row (unselected)</Text>
        <Card padding="md" style={{ border: "1px solid var(--mantine-color-dark-4)" }}>
          <Group justify="space-between">
            <Group gap={8}>
              <IconSignature size={18} />
              <Text fw={600}>Collect signature</Text>
            </Group>
          </Group>
        </Card>
      </Stack>

      <Stack gap={4}>
        <Text size="sm" c="dimmed">Toggleable row (active/green)</Text>
        <Card padding="md" style={{ border: "1px solid var(--mantine-color-green-6)" }}>
          <Group justify="space-between">
            <Group gap={8}>
              <IconSignature size={18} color="var(--mantine-color-green-6)" />
              <Text fw={600} c="green">Signature collected</Text>
            </Group>
          </Group>
        </Card>
      </Stack>
    </SimpleGrid>
  ),
};
