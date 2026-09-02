// The interactive base under every custom toggle: BottomNav's tab items,
// the Delivered/Returned outcome cards, and the signature-collect row. No
// default styling — the child Card/Stack supplies the actual look, this
// just makes the whole area a real click target.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const meta: Meta<typeof UnstyledButton> = {
  title: "Components/UnstyledButton",
  component: UnstyledButton,
};
export default meta;

type Story = StoryObj<typeof UnstyledButton>;

export const Playground: Story = {
  args: {
    children: (
      <Card padding="lg" radius={32} style={{ border: "2px solid var(--mantine-color-signal-6)" }}>
        <Stack align="center" gap={6}>
          <IconCircleCheckFilled size={26} color="var(--mantine-color-green-6)" />
          <Text fw={700} c="green">Delivered</Text>
        </Stack>
      </Card>
    ),
  },
};

export const AllVariants: Story = {
  name: "As an outcome-selector card (gallery)",
  render: () => (
    <UnstyledButton>
      <Card padding="lg" radius={32} style={{ border: "2px solid var(--mantine-color-signal-6)" }}>
        <Stack align="center" gap={6}>
          <IconCircleCheckFilled size={26} color="var(--mantine-color-green-6)" />
          <Text fw={700} c="green">Delivered</Text>
        </Stack>
      </Card>
    </UnstyledButton>
  ),
};
