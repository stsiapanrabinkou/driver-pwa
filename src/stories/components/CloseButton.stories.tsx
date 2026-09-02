// Used as the clear ("×") affordance inside the Shipments search field,
// shown only once the field has a value.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CloseButton, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const meta: Meta<typeof CloseButton> = {
  title: "Components/CloseButton",
  component: CloseButton,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};
export default meta;

type Story = StoryObj<typeof CloseButton>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "As a search field's clear button (gallery)",
  render: () => (
    <Group gap="md" w={340}>
      <TextInput
        w="100%"
        value="HC-4821"
        readOnly
        leftSection={<IconSearch size={18} />}
        rightSection={<CloseButton />}
      />
    </Group>
  ),
};
