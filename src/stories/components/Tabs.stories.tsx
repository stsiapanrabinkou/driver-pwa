// Two spots: Shipment Details (Timeline/Documents) and Shipments
// (Today/Upcoming/Archived). Tab label is a plain Text (size 17px, weight
// 700 active / 500 dimmed inactive) rather than Tabs.Tab's own label
// prop — gives control over the exact rhythm used elsewhere. Tabs.List
// gets mx (not px) so its own underline separator is inset too, not just
// the tabs.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Tabs, Text } from "@mantine/core";

const TAB_VALUES = ["today", "upcoming", "archived"];

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

function PlaygroundRender() {
  const [tab, setTab] = useState("today");
  return (
    <Stack w={380}>
      <Tabs value={tab} onChange={(v) => v && setTab(v)}>
        <Tabs.List grow mx={8}>
          {TAB_VALUES.map((value) => (
            <Tabs.Tab key={value} value={value} h={48}>
              <Text size="17px" fw={tab === value ? 700 : 500} c={tab === value ? undefined : "dimmed"}>
                {value[0].toUpperCase() + value.slice(1)}
              </Text>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Stack>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "Interactive tab strip (gallery)",
  render: () => <PlaygroundRender />,
};
