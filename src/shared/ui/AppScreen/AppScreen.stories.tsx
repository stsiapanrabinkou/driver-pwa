// The page shell every screen renders inside — phone-width column, header
// fixed above the scroll area, footer fixed below it. header/children/footer
// are ReactNode, so there's no meaningful Controls playground here (nothing
// to toggle) — instead: one story showing the shell doing its actual job
// (header + long scrolling content + footer all staying put), and a gallery
// comparing it with vs. without header/footer.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack, Text } from "@mantine/core";
import { AppScreen } from "./AppScreen";
import { BottomNav } from "../BottomNav/BottomNav";
import { SyncStatusBar } from "../SyncStatusBar/SyncStatusBar";
import { mockPendingSync } from "../SyncStatusBar/mockPendingSync";

function ScrollProbeContent() {
  return (
    <Stack gap="md" p="md">
      <Text fw={700}>Scrollable content</Text>
      {Array.from({ length: 20 }, (_, i) => (
        <Box key={i} bg="dark.6" p="md" style={{ borderRadius: "var(--mantine-radius-md)" }}>
          Row {i + 1} — header and footer stay fixed while this scrolls.
        </Box>
      ))}
    </Stack>
  );
}

function PhoneViewport({ children }: { children: React.ReactNode }) {
  return (
    <Box style={{ maxWidth: 480, height: 700, margin: "0 auto", overflow: "hidden" }}>
      {children}
    </Box>
  );
}

const meta: Meta<typeof AppScreen> = {
  title: "Components/AppScreen",
  component: AppScreen,
  decorators: [(Story) => <PhoneViewport><Story /></PhoneViewport>],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AppScreen>;

export const Playground: Story = {
  name: "Header + scrolling content + footer",
  args: {
    header: <SyncStatusBar pendingItems={mockPendingSync} onRetry={() => console.log("retry sync")} />,
    children: <ScrollProbeContent />,
    footer: <BottomNav active="home" />,
  },
};

export const WithoutChrome: Story = {
  name: "No header/footer (gallery)",
  args: { children: <ScrollProbeContent /> },
};
