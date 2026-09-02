// Theme default: size="lg" (48px). Used for search, recipient name,
// document name, and (with a right-section CloseButton) the Shipments
// search field.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CloseButton, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  component: TextInput,
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "text" },
  },
  args: { placeholder: "Full name" },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "In-app usages (gallery)",
  render: () => (
    <Stack gap="md" w={320}>
      <TextInput placeholder="Full name" />
      <TextInput
        placeholder="Search by ID or address"
        leftSection={<IconSearch size={18} />}
        rightSection={<CloseButton />}
        defaultValue="HC-4821"
      />
      <TextInput label="With error" error="This field is required" />
    </Stack>
  ),
};
