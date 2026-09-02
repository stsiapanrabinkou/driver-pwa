// DocumentViewerModal — always opened. Controls switch between a PDF
// (scrollable multi-page preview) and an image (single-frame preview) —
// the one thing that changes the body's layout.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocumentViewerModal } from "./DocumentViewerModal";
import type { ShipmentDocument } from "./documents";

const DOCS: Record<string, ShipmentDocument> = {
  "PDF — Bill of lading.pdf": {
    id: "doc-bol", name: "Bill of lading.pdf", timestamp: "Yesterday, 16:00", uploadedBy: "Dispatch", type: "other",
  },
  "Image — Proof of delivery.jpg": {
    id: "doc-pod", name: "Proof of delivery.jpg", timestamp: "Today, 14:44", uploadedBy: "You", type: "proof_of_delivery",
  },
};

interface StoryArgs {
  document: keyof typeof DOCS;
}

const meta: Meta<StoryArgs> = {
  title: "Screens/Document Viewer",
  argTypes: {
    document: { control: "select", options: Object.keys(DOCS) },
  },
  args: { document: "PDF — Bill of lading.pdf" },
};
export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: ({ document }) => (
    <DocumentViewerModal
      document={DOCS[document]}
      shipmentId="HC-9284471"
      onClose={() => console.log("close")}
    />
  ),
};
