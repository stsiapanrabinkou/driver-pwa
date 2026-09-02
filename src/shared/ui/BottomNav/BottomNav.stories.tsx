// Every tab BottomNav can highlight, plus the "nothing active" state used on
// screens that aren't one of the 5 main tabs (e.g. Shipment Details). One
// controllable story + a fixed gallery of all 6 states stacked for scanning.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack, Text } from "@mantine/core";
import { BottomNav, type BottomNavKey } from "./BottomNav";

const KEYS: BottomNavKey[] = ["home", "shipments", "messages", "documents", "profile"];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return <Box style={{ maxWidth: 480, margin: "0 auto" }}>{children}</Box>;
}

const meta: Meta<typeof BottomNav> = {
  title: "Components/BottomNav",
  component: BottomNav,
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  argTypes: {
    active: { control: "select", options: [...KEYS, undefined] },
  },
};
export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Playground: Story = {
  args: { active: "home" },
};

export const AllStates: Story = {
  name: "All states (gallery)",
  render: () => (
    <Stack gap="md">
      {[...KEYS, undefined].map((key) => (
        <Stack key={key ?? "none"} gap={4}>
          <Text size="sm" c="dimmed" ff="monospace">active: {key ? `"${key}"` : "undefined"}</Text>
          <BottomNav active={key} />
        </Stack>
      ))}
    </Stack>
  ),
};
