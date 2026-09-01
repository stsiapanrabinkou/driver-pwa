import { useRef, useState, type MouseEvent } from "react";
import {
  ActionIcon, Button, Card, Collapse, FileButton, Group, Modal, Radio, Stack, Text, TextInput, UnstyledButton,
} from "@mantine/core";
import {
  IconArrowLeft, IconChevronRight, IconCircleCheckFilled,
  IconPaperclip, IconRotateClockwise2, IconSignature, IconTrash,
} from "@tabler/icons-react";
import { ATTACH_CARD_HEIGHT, formatFileSize, splitFileName } from "./fileAttachment";

export type DeliveryOutcome = "delivered" | "returned";
export type ReturnReason = "recipient_refused" | "address_not_found" | "damaged_goods" | "other";

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: "recipient_refused", label: "Recipient refused" },
  { value: "address_not_found", label: "Address not found" },
  { value: "damaged_goods", label: "Damaged goods" },
  { value: "other", label: "Other" },
];

const OUTCOME_META = {
  delivered: { label: "Delivered", icon: IconCircleCheckFilled, color: "green" },
  returned: { label: "Returned", icon: IconRotateClockwise2, color: "red" },
} as const;

// Cards in this modal, radius 32 to match Home's rhythm.
const CARD_RADIUS = 32;

export interface CompleteDeliveryResult {
  outcome: DeliveryOutcome;
  recipientName?: string;
  signatureCollected?: boolean;
  returnReason?: ReturnReason;
}

export interface CompleteDeliveryModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (result: CompleteDeliveryResult) => void;
}

export function CompleteDeliveryModal({ opened, onClose, onSubmit }: CompleteDeliveryModalProps) {
  const [outcome, setOutcome] = useState<DeliveryOutcome>("delivered");
  // Same shape as AddDocumentModal's attach-file state — extension/size come
  // from the real picked File, not a bare boolean toggle. podName is the
  // editable, extension-less name shown in its own field once attached,
  // exactly like AddDocumentModal's Document name.
  const [podName, setPodName] = useState("");
  const [podFileMeta, setPodFileMeta] = useState<{ extension: string; sizeLabel: string } | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [signatureCollected, setSignatureCollected] = useState(false);
  const [returnReason, setReturnReason] = useState<ReturnReason | null>(null);
  const resetPodFileRef = useRef<() => void>(null);

  // POD document isn't required here — it can be attached separately from
  // the Documents tab afterward. Recipient name is the only hard requirement
  // for marking a delivery complete.
  const canConfirm =
    outcome === "delivered" ? recipientName.trim().length > 0 : returnReason !== null;

  function reset() {
    setOutcome("delivered");
    setPodName("");
    setPodFileMeta(null);
    resetPodFileRef.current?.();
    setRecipientName("");
    setSignatureCollected(false);
    setReturnReason(null);
  }

  function handleCancel() {
    onClose();
    reset();
  }

  function handlePodFileChange(file: File | null) {
    if (!file) return;
    const { base, extension } = splitFileName(file.name);
    setPodName(base);
    setPodFileMeta({ extension, sizeLabel: formatFileSize(file.size) });
  }

  function handleRemovePodFile(event: MouseEvent) {
    event.stopPropagation();
    setPodName("");
    setPodFileMeta(null);
    resetPodFileRef.current?.();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      fullScreen
      withCloseButton={false}
      // Same back-button + title header as every other screen in this flow
      // (ShipmentDetailsScreen, DocumentViewerModal, AddDocumentModal) — the
      // back arrow IS Cancel here, so the footer only needs one button.
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
          <Text fw={800} size="xl">Complete Delivery</Text>
        </Group>
      }
      // flex: 1 (not height: "100%") — Mantine's own modal content is
      // already a title+body flex column; claiming a *height* here ignores
      // that the title bar already took its share, so body ended up
      // wanting the full content height *on top of* the title, overflowing
      // by exactly the title bar's height and cutting the real bottom off.
      // minHeight: 0 lets this flex child actually shrink/scroll instead of
      // growing to fit its content and pushing the overflow up a level.
      // header gets flexShrink: 0 so it isn't squeezed as body's sibling in
      // that same flex column — without it, body's flex-basis calculation
      // could still leave a few px unaccounted for and overflow the content
      // box itself instead of scrolling cleanly inside body.
      styles={{
        // fullScreen's actual fixed, viewport-filling box is `inner` (`top:
        // 0, height: 100%`) — `content` itself is a static block inside it,
        // so offsetting `content` does nothing. `inner` sits BEHIND the
        // dev-only DevBar (fixed, zIndex 9999), which clipped the title row.
        // Same --devbar-height offset AppScreen's own sticky header already
        // uses; 0px in production, where DevBar never mounts.
        // `content` also needs its own height: 100% — Mantine's fullScreen
        // variant hardcodes its height to the viewport (100dvh) regardless
        // of `inner`'s size, so without this it stayed a full devbar-height
        // taller than `inner` and its bottom `devbar-height`px got clipped.
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
      {/* Same rhythm as Home: p=8 / gap=4 for the page, an extra px=8 on
          section headers (stacking with the container's own 8 = 16 total),
          everything else flush at 8.
          mih="100%" + flex:1 on the content block below is what actually
          pins Confirm to the bottom when there isn't enough content to push
          it there on its own — sticky alone only holds position *while
          scrolling*, it doesn't reach for the bottom of a short page. */}
      <Stack gap={4} mih="100%">
        {/* gap=32 between blocks — outcome, POD photo, name, signature are
            each a distinct decision, not a tight related-fields cluster
            (same rhythm as AddDocumentModal's field groups). Each block is
            its own Stack with a tight internal gap so the 32 only shows up
            *between* blocks, not inside one. */}
        <Stack gap={32} p={8} style={{ flex: 1 }}>
          <Stack gap="xs">
            <Text fw={700} px={8}>Delivery outcome</Text>
            <Group grow gap={4}>
              {(["delivered", "returned"] as const).map((value) => {
                const active = outcome === value;
                const { label, icon: Icon, color } = OUTCOME_META[value];
                return (
                  <UnstyledButton key={value} onClick={() => setOutcome(value)}>
                    <Card
                      padding="lg"
                      radius={CARD_RADIUS}
                      style={{
                        border: `2px solid ${active ? `var(--mantine-color-${color}-6)` : "transparent"}`,
                      }}
                    >
                      <Stack align="center" gap={6}>
                        <Icon size={26} color={active ? `var(--mantine-color-${color}-6)` : "var(--mantine-color-dimmed)"} />
                        <Text fw={700} c={active ? color : undefined}>
                          {label}
                        </Text>
                      </Stack>
                    </Card>
                  </UnstyledButton>
                );
              })}
            </Group>
          </Stack>

          {outcome === "delivered" ? (
            <>
              <Stack gap="xs">
                <Text fw={700} px={8}>
                  Recipient name <Text span c="red" fw={700}>*</Text>
                </Text>
                {/* Theme's default size="lg" ships at 50px via Mantine's
                    --input-height var (see the same gotcha noted on
                    AddDocumentModal's Select) — overriding both height and
                    minHeight is what actually lands this at 48px. */}
                <TextInput
                  placeholder="Full name"
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.currentTarget.value)}
                  styles={{ input: { height: 48, minHeight: 48 } }}
                />
              </Stack>

              <Stack gap="xs">
                <Text fw={700} px={8}>Recipient signature</Text>
                <UnstyledButton onClick={() => setSignatureCollected((v) => !v)}>
                  <Card
                    padding="md"
                    radius={CARD_RADIUS}
                    h={ATTACH_CARD_HEIGHT}
                    style={{
                      border: `1px solid ${signatureCollected ? "var(--mantine-color-green-6)" : "var(--mantine-color-dark-4)"}`,
                    }}
                  >
                    <Group justify="space-between" h="100%">
                      <Group gap={8}>
                        <IconSignature size={18} color={signatureCollected ? "var(--mantine-color-green-6)" : undefined} />
                        <Text c={signatureCollected ? "green" : undefined} fw={600}>
                          {signatureCollected ? "Signature collected" : "Collect signature"}
                        </Text>
                      </Group>
                      <IconChevronRight size={16} />
                    </Group>
                  </Card>
                </UnstyledButton>
              </Stack>

              <Stack gap="xs">
                <Text fw={700} px={8}>Proof of Delivery</Text>

                {/* Same file-attach mechanism as the Documents tab's Add
                    Document flow — one Card shape, dashed/signal before,
                    solid/green with extension + size + delete after, pinned
                    to ATTACH_CARD_HEIGHT so the state change doesn't resize
                    the box. FileButton wraps a real (hidden) file input.
                    This attachment IS a Proof of Delivery document — no type
                    picker needed, that's fixed by which button opened this
                    modal in the first place. */}
                <FileButton resetRef={resetPodFileRef} onChange={handlePodFileChange} accept="image/*,.pdf">
                  {(props) => (
                    <Card
                      padding="md"
                      radius={CARD_RADIUS}
                      h={ATTACH_CARD_HEIGHT}
                      style={{
                        cursor: "pointer",
                        border: podFileMeta
                          ? "1px solid var(--mantine-color-dark-4)"
                          : "2px dashed var(--mantine-color-signal-4)",
                      }}
                      {...props}
                    >
                      {podFileMeta ? (
                        <Group justify="space-between" wrap="nowrap" h="100%">
                          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                            <IconPaperclip size={20} color="var(--mantine-color-green-6)" />
                            <Stack gap={0} style={{ minWidth: 0 }}>
                              <Text fw={600} truncate>{podName}</Text>
                              <Text size="sm" c="dimmed">{podFileMeta.extension} · {podFileMeta.sizeLabel}</Text>
                            </Stack>
                          </Group>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            radius="xl"
                            onClick={handleRemovePodFile}
                            aria-label="Remove file"
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      ) : (
                        <Stack align="center" justify="center" gap={6} h="100%">
                          <IconPaperclip size={18} color="var(--mantine-color-signal-6)" />
                          <Text fw={600} c="signal">Take photo or choose file</Text>
                          <Text size="sm" c="dimmed">PDF, JPG, PNG · up to 10 MB</Text>
                        </Stack>
                      )}
                    </Card>
                  )}
                </FileButton>
              </Stack>

              {/* Name has nothing to default to before a file exists — no
                  point showing an editable field with no subject yet.
                  Collapse eases it in once picked, instead of the layout
                  jumping. 1:1 with AddDocumentModal's own Document name
                  block — same label, same field, same behavior. */}
              <Collapse expanded={podFileMeta !== null}>
                <Stack gap="xs">
                  <Text fw={700} px={8}>Document name</Text>
                  <TextInput
                    value={podName}
                    onChange={(event) => setPodName(event.currentTarget.value)}
                  />
                </Stack>
              </Collapse>
            </>
          ) : (
            <Stack gap="xs">
              <Text fw={700} px={8}>Reason for return</Text>
              <Radio.Group
                value={returnReason ?? ""}
                onChange={(value) => setReturnReason(value as ReturnReason)}
              >
                <Stack gap="sm">
                  {RETURN_REASONS.map(({ value, label }) => (
                    <Radio.Card key={value} value={value} p="md" radius={CARD_RADIUS}>
                      <Radio.Indicator mr="sm" />
                      <Text fw={600}>{label}</Text>
                    </Radio.Card>
                  ))}
                </Stack>
              </Radio.Group>
            </Stack>
          )}
        </Stack>

        {/* Just one button now — Cancel moved up into the back button, and
            no camera icon here since attaching already happened above. */}
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
            disabled={!canConfirm}
            onClick={() => {
              onSubmit({ outcome, recipientName, signatureCollected, returnReason: returnReason ?? undefined });
              reset();
            }}
          >
            {outcome === "delivered" ? "Confirm Delivery" : "Confirm Return"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default CompleteDeliveryModal;
