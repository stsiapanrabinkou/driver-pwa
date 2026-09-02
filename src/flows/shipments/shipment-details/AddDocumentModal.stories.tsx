// AddDocumentModal — always opened, so the full flow (type select, real
// file attach via FileButton, auto-named field) is reviewable directly in
// the canvas.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddDocumentModal } from "./AddDocumentModal";

const meta: Meta<typeof AddDocumentModal> = {
  title: "Screens/Add Document",
  component: AddDocumentModal,
  args: {
    opened: true,
    onClose: () => console.log("close"),
    onUpload: (type, name) => console.log("upload", type, name),
  },
};
export default meta;

type Story = StoryObj<typeof AddDocumentModal>;

export const Default: Story = {};
