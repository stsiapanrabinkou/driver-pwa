// Theme default: size="lg". Used for Report an Issue's optional notes and
// Complete Delivery's return comment — both minRows=3, autosize.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@mantine/core";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  argTypes: {
    disabled: { control: "boolean" },
    autosize: { control: "boolean" },
  },
  args: {
    placeholder: "Add any additional details…",
    minRows: 3,
    autosize: true,
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "Empty vs filled (gallery)",
  render: () => (
    <Textarea
      minRows={3}
      autosize
      defaultValue="Recipient wasn't home; left a delivery notice at the door."
      w={320}
    />
  ),
};
