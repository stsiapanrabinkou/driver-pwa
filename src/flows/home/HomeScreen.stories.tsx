// Home screen — one story, driven entirely by Controls: a friendly preset
// for the sync bar's state, and a toggle for whether there are active
// shipments. Both map onto HomeScreen's own props (mock defaults), so
// nothing lives in the screen itself — see AGENTS.md §3.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@mantine/core";
import { HomeScreen } from "./HomeScreen";
import { mockShipments } from "../../shared/ui/ShipmentCard/mockShipments";
import { mockPendingSync } from "../../shared/ui/SyncStatusBar/mockPendingSync";

const SYNC_PRESETS = {
  "Offline · Pending": { syncConnection: "offline" as const, syncPendingItems: mockPendingSync },
  "Offline · Fully synced": { syncConnection: "offline" as const, syncPendingItems: [] },
  "Online · Syncing": { syncConnection: "online" as const, syncPendingItems: mockPendingSync },
  "Online · Fully synced": { syncConnection: "online" as const, syncPendingItems: [] },
};
type SyncPreset = keyof typeof SYNC_PRESETS;

// AppScreen fills 100vh — cap the story canvas to a phone-ish viewport so it
// doesn't render as one giant scroll in the Storybook iframe.
function PhoneViewport({ children }: { children: React.ReactNode }) {
  return (
    <Box style={{ maxWidth: 480, height: 800, margin: "0 auto", overflow: "auto" }}>
      {children}
    </Box>
  );
}

interface HomeStoryArgs {
  syncState: SyncPreset;
  hasActiveShipments: boolean;
}

const meta: Meta<HomeStoryArgs> = {
  title: "Screens/Home",
  decorators: [(Story) => <PhoneViewport><Story /></PhoneViewport>],
  parameters: { layout: "fullscreen" },
  argTypes: {
    syncState: { control: "select", options: Object.keys(SYNC_PRESETS) },
    hasActiveShipments: { control: "boolean" },
  },
  args: {
    syncState: "Offline · Pending",
    hasActiveShipments: true,
  },
};
export default meta;

type Story = StoryObj<HomeStoryArgs>;

export const Default: Story = {
  render: ({ syncState, hasActiveShipments }) => (
    <HomeScreen
      {...SYNC_PRESETS[syncState]}
      activeShipments={hasActiveShipments ? mockShipments : []}
    />
  ),
};
