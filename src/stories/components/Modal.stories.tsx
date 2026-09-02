// Every overlay "screen" in the shipment-details flow is a fullScreen
// Modal — Add Document, Complete Delivery, Document Viewer, Report an
// Issue. Theme default: radius="lg", shadow="xl", content capped to the
// app's own 768px column. fullScreen needs two extra fixes documented
// here: `inner` (not `content`) is the actual fixed, viewport-filling box,
// and `content` needs an explicit height:"100%"/width:"100%" or it either
// overflows by the DevBar's height or stops short of wide screens.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionIcon, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  argTypes: {
    fullScreen: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

function PlaygroundRender() {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <Button variant="default" onClick={() => setOpened(true)}>Open</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        fullScreen
        withCloseButton={false}
        title={
          <Group gap="sm" wrap="nowrap">
            <ActionIcon
              variant="default"
              size={48}
              radius="xl"
              bg="dark.6"
              style={{ border: "none" }}
              onClick={() => setOpened(false)}
            >
              <IconArrowLeft size={22} />
            </ActionIcon>
            <Text fw={800} size="xl">Add Document</Text>
          </Group>
        }
        styles={{
          inner: { top: "var(--devbar-height, 0px)", height: "calc(100% - var(--devbar-height, 0px))" },
          content: { display: "flex", flexDirection: "column", height: "100%", width: "100%", maxWidth: "100%", margin: 0 },
          header: { flexShrink: 0, padding: "var(--mantine-spacing-md) 8px" },
          body: { padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowY: "auto" },
        }}
      >
        <Stack gap={4} p={8} mih="100%">
          <Text c="dimmed">Full-screen modal body content goes here.</Text>
        </Stack>
      </Modal>
    </>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "Back-button header pattern (gallery)",
  render: () => <PlaygroundRender />,
};
