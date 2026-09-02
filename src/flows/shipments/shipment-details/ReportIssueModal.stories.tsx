// ReportIssueModal — always opened, so the reason list and notes field are
// reviewable directly in the canvas.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReportIssueModal } from "./ReportIssueModal";

const meta: Meta<typeof ReportIssueModal> = {
  title: "Screens/Report an Issue",
  component: ReportIssueModal,
  args: {
    opened: true,
    onClose: () => console.log("close"),
    onSubmit: (reason, notes) => console.log("submit", reason, notes),
  },
};
export default meta;

type Story = StoryObj<typeof ReportIssueModal>;

export const Default: Story = {};
