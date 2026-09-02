// Add Document's "Document type" field. Theme default: size="lg" (48px,
// matching every other input). maxDropdownHeight bumped to 400 so its 5
// options open fully instead of scrolling; comboboxProps offset tuned to
// -1 so the visual gap to the dropdown reads as 4px (a 5px baseline gap
// exists even at offset:0 — the prop is additive on top of it).

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@mantine/core";

const DOC_TYPES = [
  { value: "proof_of_delivery", label: "Proof of Delivery" },
  { value: "delivery_receipt", label: "Delivery Receipt" },
  { value: "signed_document", label: "Signed Document" },
  { value: "damage_photo", label: "Damage Photo" },
  { value: "other", label: "Other" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    data: DOC_TYPES,
    allowDeselect: false,
    maxDropdownHeight: 400,
    comboboxProps: { offset: -1 },
    styles: { input: { height: 48, minHeight: 48 } },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

function PlaygroundRender() {
  const [value, setValue] = useState<string | null>("proof_of_delivery");
  return (
    <Select
      data={DOC_TYPES}
      value={value}
      onChange={setValue}
      allowDeselect={false}
      maxDropdownHeight={400}
      comboboxProps={{ offset: -1 }}
      styles={{ input: { height: 48, minHeight: 48 } }}
      w={280}
    />
  );
}

export const Playground: Story = {
  render: () => <PlaygroundRender />,
};

export const AllVariants: Story = {
  name: "Document type field (gallery)",
  render: () => <PlaygroundRender />,
};
