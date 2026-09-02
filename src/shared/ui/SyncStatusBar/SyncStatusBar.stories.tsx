// SyncStatusBar states — offline with a few pending changes (no scroll),
// offline with a long queue (scrolls), and fully synced (nothing pending).
// These are Props variations only; the component itself doesn't change.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack, Text } from "@mantine/core";
import { within, userEvent } from "storybook/test";
import { SyncStatusBar } from "./SyncStatusBar";
import { mockPendingSync } from "./mockPendingSync";

// The panel overlays with position: absolute against the bar, so it needs a
// phone-width host to read the same way it does inside AppScreen.
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return <Box style={{ maxWidth: 480, margin: "0 auto" }}>{children}</Box>;
}

const meta: Meta<typeof SyncStatusBar> = {
  title: "Components/SyncStatusBar",
  component: SyncStatusBar,
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  argTypes: {
    connection: { control: "select", options: ["offline", "online"] },
  },
  args: {
    onRetry: () => console.log("retry sync"),
  },
};
export default meta;

type Story = StoryObj<typeof SyncStatusBar>;

// Controls-driven single instance — the base pair every other component
// story starts with, kept alongside the named states below since this
// component's states are too state-machine-y (collapsed/expanded × pending
// queue length × connection) to fold into one Controls-only story.
export const Playground: Story = {
  args: { connection: "offline", pendingItems: mockPendingSync.slice(0, 3) },
};

export const AllStates: Story = {
  name: "All states (gallery)",
  render: () => (
    <PhoneFrame>
      <Stack gap="md">
        {(
          [
            ["Offline · pending", { connection: "offline" as const, pendingItems: mockPendingSync.slice(0, 3) }],
            ["Offline · fully synced", { connection: "offline" as const, pendingItems: [] }],
            ["Online · syncing", { connection: "online" as const, pendingItems: mockPendingSync.slice(0, 3) }],
            ["Online · fully synced", { connection: "online" as const, pendingItems: [] }],
          ] as const
        ).map(([label, props]) => (
          <Stack key={label} gap={4}>
            <Text size="sm" c="dimmed">{label}</Text>
            <SyncStatusBar {...props} onRetry={() => console.log("retry sync")} />
          </Stack>
        ))}
      </Stack>
    </PhoneFrame>
  ),
};

export const OfflineFewPendingCollapsed: Story = {
  name: "Offline · Few pending, no scroll (collapsed)",
  args: { pendingItems: mockPendingSync.slice(0, 3) },
};

export const OfflineFewPendingExpanded: Story = {
  name: "Offline · Few pending, no scroll (expanded)",
  args: { pendingItems: mockPendingSync.slice(0, 3) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(/items not synced/i));
  },
};

export const OfflineManyPendingExpanded: Story = {
  name: "Offline · Many pending, scrolls (expanded)",
  args: { pendingItems: mockPendingSync },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(/items not synced/i));
  },
};

export const Synced: Story = {
  name: "Offline · Fully synced",
  args: { pendingItems: [] },
};

export const OnlineSyncingExpanded: Story = {
  name: "Online · Syncing (expanded)",
  args: { connection: "online", pendingItems: mockPendingSync.slice(0, 3) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // "Syncing …" also appears in the (still-mounted, collapsed) panel
    // header below, so match on all and click the bar's copy — the first,
    // by DOM order — rather than a single findByText, which throws on the
    // ambiguous match.
    const [barText] = await canvas.findAllByText(/Syncing/i);
    await userEvent.click(barText);
  },
};

export const OnlineSynced: Story = {
  name: "Online · Fully synced",
  args: { connection: "online", pendingItems: [] },
};
