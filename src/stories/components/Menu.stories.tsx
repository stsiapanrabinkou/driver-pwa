// Document Viewer's overflow menu — dropdown radius bumped a step above its
// items' radius (20 vs the item's 16, "lg") so the outer shell reads as the
// bigger, containing shape; items sized up from Mantine's compact default.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionIcon, Menu } from "@mantine/core";
import { IconDots, IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  argTypes: {
    position: { control: "select", options: ["bottom-end", "bottom-start", "top-end", "top-start"] },
  },
};
export default meta;

type Story = StoryObj<typeof Menu>;

function DocumentMenu() {
  return (
    <Menu
      position="bottom-end"
      withinPortal
      opened
      styles={{
        item: { fontSize: "var(--mantine-font-size-md)", padding: "12px 16px" },
        itemSection: { marginInlineEnd: 12 },
        dropdown: { borderRadius: 20 },
      }}
    >
      <Menu.Target>
        <ActionIcon variant="default" size={48} radius="xl" bg="dark.6" style={{ border: "none" }}>
          <IconDots size={22} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconDownload size={20} />}>Save to device</Menu.Item>
        <Menu.Item leftSection={<IconEdit size={20} />}>Rename</Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={20} />}>Delete</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export const Playground: Story = {
  render: () => <DocumentMenu />,
};

export const AllVariants: Story = {
  name: "Document Viewer overflow menu (gallery)",
  render: () => <DocumentMenu />,
};
