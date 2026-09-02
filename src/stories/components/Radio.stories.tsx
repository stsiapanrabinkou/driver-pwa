// Radio.Card is used for "Reason for return" (Complete Delivery) and
// "What's the issue?" (Report an Issue). Radio.Card lays its children out
// in a plain block by default — the indicator and label only sit side by
// side once wrapped in a Group. Rest state: grey fill (dark.6), no visible
// border. Selected: 2px signal border, same treatment as the outcome cards.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Radio, Stack, Text } from "@mantine/core";

const REASONS = ["Recipient refused", "Address not found", "Damaged goods", "Other"];

const meta: Meta = {
  title: "Components/Radio",
};
export default meta;

type Story = StoryObj;

function PlaygroundRender() {
  const [value, setValue] = useState("Damaged goods");
  return (
    <Radio.Group value={value} onChange={setValue}>
      <Stack gap={4} w={340}>
        {REASONS.map((label) => {
          const active = value === label;
          return (
            <Radio.Card
              key={label}
              value={label}
              px="md"
              h={48}
              bg="dark.6"
              radius="lg"
              style={{ border: active ? "2px solid var(--mantine-color-signal-6)" : "none" }}
            >
              <Group gap="sm" h="100%" wrap="nowrap">
                <Radio.Indicator />
                <Text fw={600}>{label}</Text>
              </Group>
            </Radio.Card>
          );
        })}
      </Stack>
    </Radio.Group>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "Reason list, selected state (gallery)",
  render: () => <PlaygroundRender />,
};
