// Shipment Details' event history. Two gotchas baked into this usage:
// `active` is a threshold (active >= index), not a count — off by one and
// one extra future item reads as done. And Mantine hardcodes an active
// bullet's fill to white regardless of `color`, so the green checkmark
// fill needs an explicit styles.itemBullet override.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const EVENTS = [
  { title: "Shipment planned", date: "Yesterday, 16:00", done: true },
  { title: "Shipment started", date: "Today, 08:12", done: true },
  { title: "Arrived at pickup", date: "Today, 08:40", done: true },
  { title: "Departed from pickup", date: "Not started yet", done: false },
];

const meta: Meta<typeof Timeline> = {
  title: "Components/Timeline",
  component: Timeline,
  argTypes: {
    active: { control: { type: "number", min: -1, max: EVENTS.length } },
  },
  args: { active: 2, bulletSize: 24, lineWidth: 2 },
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Playground: Story = {
  render: (args) => (
    <Timeline {...args} w={320}>
      {EVENTS.map((event) => (
        <Timeline.Item
          key={event.title}
          title={event.title}
          color={event.done ? "green" : undefined}
          bullet={event.done ? <IconCheck size={12} stroke={4} color="var(--mantine-color-dark-7)" /> : undefined}
          styles={event.done ? { itemBullet: { backgroundColor: "var(--mantine-color-green-6)" } } : undefined}
        >
          {event.date}
        </Timeline.Item>
      ))}
    </Timeline>
  ),
};

export const AllVariants: Story = {
  name: "In-progress shipment (gallery)",
  render: () => (
    <Timeline active={2} bulletSize={24} lineWidth={2} w={320}>
      {EVENTS.map((event) => (
        <Timeline.Item
          key={event.title}
          title={event.title}
          color={event.done ? "green" : undefined}
          bullet={event.done ? <IconCheck size={12} stroke={4} color="var(--mantine-color-dark-7)" /> : undefined}
          styles={event.done ? { itemBullet: { backgroundColor: "var(--mantine-color-green-6)" } } : undefined}
        >
          {event.date}
        </Timeline.Item>
      ))}
    </Timeline>
  ),
};
