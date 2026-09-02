// The render-prop wrapper around a real (hidden) file input — every
// attach-file card in the app (Add Document, Complete Delivery's POD photo)
// is built on this rather than a bare state toggle, so the picked file's
// real name/size/extension are available.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, FileButton, Group, Stack, Text } from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";

const meta: Meta<typeof FileButton> = {
  title: "Components/FileButton",
  component: FileButton,
  argTypes: {
    accept: { control: "text" },
    multiple: { control: "boolean" },
  },
  args: { accept: "image/*,.pdf" },
};
export default meta;

type Story = StoryObj<typeof FileButton>;

function PlaygroundRender() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <FileButton onChange={setFile} accept="image/*,.pdf">
      {(props) => (
        <Card
          padding="md"
          h={88}
          w={320}
          style={{
            cursor: "pointer",
            border: file ? "1px solid var(--mantine-color-dark-4)" : "2px dashed var(--mantine-color-signal-4)",
          }}
          {...props}
        >
          {file ? (
            <Group gap="sm" h="100%" wrap="nowrap">
              <IconPaperclip size={20} color="var(--mantine-color-green-6)" />
              <Text fw={600}>{file.name}</Text>
            </Group>
          ) : (
            <Stack align="center" justify="center" gap={6} h="100%">
              <IconPaperclip size={18} color="var(--mantine-color-signal-6)" />
              <Text fw={600} c="signal">Take photo or choose file</Text>
            </Stack>
          )}
        </Card>
      )}
    </FileButton>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "Empty vs picked (gallery)",
  render: () => <PlaygroundRender />,
};
