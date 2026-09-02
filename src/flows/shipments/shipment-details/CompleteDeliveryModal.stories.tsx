// CompleteDeliveryModal — always opened, so both outcomes (Delivered /
// Returned) can be reviewed directly via the toggle in the modal itself.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompleteDeliveryModal } from "./CompleteDeliveryModal";

const meta: Meta<typeof CompleteDeliveryModal> = {
  title: "Screens/Complete Delivery",
  component: CompleteDeliveryModal,
  args: {
    opened: true,
    onClose: () => console.log("close"),
    onSubmit: (result) => console.log("submit", result),
  },
};
export default meta;

type Story = StoryObj<typeof CompleteDeliveryModal>;

export const Default: Story = {};
