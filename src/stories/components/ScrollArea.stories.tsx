// SyncStatusBar's expanded pending-items panel (scrolls once the queue is
// long) and Document Viewer's PDF page stack both scroll via ScrollArea
// rather than a bare overflow style.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, ScrollArea, Stack, Text } from "@mantine/core";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  argTypes: {
    type: { control: "select", options: ["hover", "scroll", "always", "auto", "never"] },
  },
  args: { type: "auto", h: 160, w: 280 },
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Playground: Story = {
  render: (args) => (
    <ScrollArea {...args}>
      <Stack gap="xs" p="xs">
        {Array.from({ length: 10 }, (_, i) => (
          <Text key={i} size="sm">Row {i + 1}</Text>
        ))}
      </Stack>
    </ScrollArea>
  ),
};

export const AllVariants: Story = {
  name: "PDF page stack (gallery)",
  render: () => (
    <ScrollArea h={260} w={200}>
      <Stack gap={8}>
        {[1, 2, 3].map((n) => (
          <Box
            key={n}
            style={{
              aspectRatio: "3 / 4",
              borderRadius: "var(--mantine-radius-md)",
              backgroundColor: "var(--mantine-color-dark-8)",
            }}
          />
        ))}
      </Stack>
    </ScrollArea>
  ),
};
