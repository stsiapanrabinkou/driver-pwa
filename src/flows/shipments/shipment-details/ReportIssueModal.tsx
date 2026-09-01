import { useState } from "react";
import { Button, Modal, Radio, Stack, Text, Textarea } from "@mantine/core";
import {
  IconCar, IconCloudRain, IconDots, IconHourglass, IconTool, IconUser,
} from "@tabler/icons-react";

export type IssueReason = "traffic" | "weather" | "mechanical" | "customer" | "detention" | "other";

const REASONS: { value: IssueReason; label: string; icon: typeof IconCar }[] = [
  { value: "traffic", label: "Traffic", icon: IconCar },
  { value: "weather", label: "Weather", icon: IconCloudRain },
  { value: "mechanical", label: "Mechanical", icon: IconTool },
  { value: "customer", label: "Customer", icon: IconUser },
  { value: "detention", label: "Detention", icon: IconHourglass },
  { value: "other", label: "Other", icon: IconDots },
];

export interface ReportIssueModalProps {
  opened: boolean;
  onClose: () => void;
  shipmentId: string;
  from: string;
  to: string;
  onSubmit: (reason: IssueReason, notes: string) => void;
}

export function ReportIssueModal({ opened, onClose, shipmentId, from, to, onSubmit }: ReportIssueModalProps) {
  const [reason, setReason] = useState<IssueReason>("traffic");
  const [notes, setNotes] = useState("");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Report an Issue"
      fullScreen
      // fullScreen's actual fixed, viewport-filling box is `inner` (`top: 0,
      // height: 100%`) — `content` itself is a static block inside it, so
      // offsetting `content` does nothing. `inner` sits BEHIND the dev-only
      // DevBar (fixed, zIndex 9999), which clipped the title row. Same
      // --devbar-height offset AppScreen's own sticky header already uses;
      // 0px in production, where DevBar never mounts.
      // `content` also needs its own height: 100% — Mantine's fullScreen
      // variant hardcodes its height to the viewport (100dvh) regardless of
      // `inner`'s size, so without this it stayed a full devbar-height
      // taller than `inner` and its bottom `devbar-height`px got clipped.
      styles={{
        inner: {
          top: "var(--devbar-height, 0px)",
          height: "calc(100% - var(--devbar-height, 0px))",
        },
        // Mantine still applies its default size-based max-width (768px,
        // centered) to `content` even under fullScreen, so on any viewport
        // wider than that the modal box stopped short of the screen edges.
        content: { height: "100%", width: "100%", maxWidth: "100%", margin: 0 },
      }}
    >
      <Stack gap="lg">
        <Text c="dimmed">
          {shipmentId} · {from} → {to}
        </Text>

        <Stack gap="sm">
          <Text fw={700}>What's the issue?</Text>
          <Radio.Group value={reason} onChange={(value) => setReason(value as IssueReason)}>
            <Stack gap="sm">
              {REASONS.map(({ value, label, icon: Icon }) => (
                <Radio.Card key={value} value={value} p="md" radius="md">
                  <Radio.Indicator mr="sm" />
                  <Icon size={18} style={{ marginRight: 10 }} />
                  <Text fw={600}>{label}</Text>
                </Radio.Card>
              ))}
            </Stack>
          </Radio.Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={700}>Notes (optional)</Text>
          <Textarea
            placeholder="Add any additional details…"
            minRows={3}
            value={notes}
            onChange={(event) => setNotes(event.currentTarget.value)}
          />
        </Stack>

        <Button
          fullWidth
          mt="auto"
          onClick={() => {
            onSubmit(reason, notes);
            setNotes("");
          }}
        >
          Submit Report
        </Button>
      </Stack>
    </Modal>
  );
}

export default ReportIssueModal;
