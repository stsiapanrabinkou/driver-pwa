import { useState } from "react";
import {
  ActionIcon, Button, Group, Modal, Radio, Stack, Text, Textarea,
} from "@mantine/core";
import {
  IconArrowLeft, IconCar, IconCloudRain, IconDots, IconHourglass, IconTool, IconUser,
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
  onSubmit: (reason: IssueReason, notes: string) => void;
}

export function ReportIssueModal({ opened, onClose, onSubmit }: ReportIssueModalProps) {
  const [reason, setReason] = useState<IssueReason>("traffic");
  const [notes, setNotes] = useState("");

  function reset() {
    setReason("traffic");
    setNotes("");
  }

  function handleCancel() {
    onClose();
    reset();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      fullScreen
      withCloseButton={false}
      // Same back-button + title header as every other screen in this flow
      // — the back arrow IS Cancel here, so the footer only needs one
      // button.
      title={
        <Group gap="sm" wrap="nowrap">
          <ActionIcon
            data-autofocus
            variant="default"
            size={48}
            radius="xl"
            bg="dark.6"
            style={{ border: "none" }}
            onClick={handleCancel}
          >
            <IconArrowLeft size={22} />
          </ActionIcon>
          <Text fw={800} size="xl">Report an Issue</Text>
        </Group>
      }
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
        content: {
          display: "flex", flexDirection: "column", height: "100%",
          width: "100%", maxWidth: "100%", margin: 0,
        },
        header: { flexShrink: 0, padding: "var(--mantine-spacing-md) 8px" },
        body: { padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowY: "auto" },
      }}
    >
      {/* Same rhythm as CompleteDeliveryModal: p=8 / gap=4 for the page,
          mih="100%" + flex:1 on the content block pins Submit to the bottom
          even when there isn't enough content to push it there on its own. */}
      <Stack gap={4} mih="100%">
        <Stack gap={32} p={8} style={{ flex: 1 }}>
          <Stack gap="xs">
            <Text fw={700} px={8}>What's the issue?</Text>
            <Radio.Group value={reason} onChange={(value) => setReason(value as IssueReason)}>
              {/* Same Radio.Card treatment as CompleteDeliveryModal's Return
                  reasons: Group-wrapped (Radio.Card lays children out in a
                  plain block otherwise), input-height rows, grey fill at
                  rest, signal-orange border when selected. */}
              <Stack gap={4}>
                {REASONS.map(({ value, label, icon: Icon }) => {
                  const active = reason === value;
                  return (
                    <Radio.Card
                      key={value}
                      value={value}
                      px="md"
                      h={48}
                      bg="dark.6"
                      radius="lg"
                      style={{
                        border: active ? "2px solid var(--mantine-color-signal-6)" : "none",
                      }}
                    >
                      <Group gap="sm" h="100%" wrap="nowrap">
                        <Radio.Indicator />
                        <Icon size={18} />
                        <Text fw={600}>{label}</Text>
                      </Group>
                    </Radio.Card>
                  );
                })}
              </Stack>
            </Radio.Group>
          </Stack>

          <Stack gap="xs">
            <Text fw={700} px={8}>Notes <Text span c="dimmed" fw={400}>(optional)</Text></Text>
            <Textarea
              placeholder="Add any additional details…"
              value={notes}
              onChange={(event) => setNotes(event.currentTarget.value)}
              minRows={3}
              autosize
            />
          </Stack>
        </Stack>

        {/* Sticky footer, pinned to the bottom of the modal's own scrolling
            body — same pattern as every other fullScreen modal in this flow,
            so Submit never scrolls away with the content. */}
        <Group
          p={8}
          style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "var(--mantine-color-body)",
            borderTop: "1px solid var(--mantine-color-dark-4)",
          }}
        >
          <Button
            fullWidth
            onClick={() => {
              onSubmit(reason, notes);
              reset();
            }}
          >
            Submit Report
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ReportIssueModal;
