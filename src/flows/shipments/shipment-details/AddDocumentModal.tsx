import { useRef, useState, type MouseEvent } from "react";
import {
  ActionIcon, Button, Card, Collapse, FileButton, Group, Modal, Select, Stack, Text, TextInput,
} from "@mantine/core";
import { IconArrowLeft, IconPaperclip, IconPlus, IconTrash } from "@tabler/icons-react";
import { ATTACH_CARD_HEIGHT, formatFileSize, splitFileName } from "./fileAttachment";

// Matches CompleteDeliveryModal's card rhythm — same dashed-before /
// solid-after pattern for a file-attach affordance.
const CARD_RADIUS = 32;

export type DocumentType = "proof_of_delivery" | "delivery_receipt" | "signed_document" | "damage_photo" | "other";

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "proof_of_delivery", label: "Proof of Delivery" },
  { value: "delivery_receipt", label: "Delivery Receipt" },
  { value: "signed_document", label: "Signed Document" },
  { value: "damage_photo", label: "Damage Photo" },
  { value: "other", label: "Other" },
];

// Suggested name per type — prefills the name field so most uploads need
// zero typing; still just a starting point, the field stays editable. No
// extension — that's a file-format detail, not part of the document's name.
const DOC_TYPE_DEFAULT_NAME: Record<DocumentType, string> = {
  proof_of_delivery: "Proof of delivery", delivery_receipt: "Delivery receipt",
  signed_document: "Signed document", damage_photo: "Damage photo", other: "Document",
};

const DEFAULT_TYPE: DocumentType = "proof_of_delivery";

export interface AddDocumentModalProps {
  opened: boolean;
  onClose: () => void;
  onUpload: (type: DocumentType, name: string) => void;
}

export function AddDocumentModal({ opened, onClose, onUpload }: AddDocumentModalProps) {
  const [type, setType] = useState<DocumentType>(DEFAULT_TYPE);
  const [name, setName] = useState(DOC_TYPE_DEFAULT_NAME[DEFAULT_TYPE]);
  // Extension and size come straight from the picked File, not the (name)
  // field above — name is the editable, extension-less part.
  const [fileMeta, setFileMeta] = useState<{ extension: string; sizeLabel: string } | null>(null);
  const resetFileRef = useRef<() => void>(null);

  function reset() {
    setType(DEFAULT_TYPE);
    setName(DOC_TYPE_DEFAULT_NAME[DEFAULT_TYPE]);
    setFileMeta(null);
    resetFileRef.current?.();
  }

  function handleTypeChange(value: string) {
    const nextType = value as DocumentType;
    setType(nextType);
    // Swaps the suggested name to match the new type — same "starting
    // point, not locked" contract as the initial prefill. Once a real file
    // is picked below, its own name takes over instead.
    if (!fileMeta) setName(DOC_TYPE_DEFAULT_NAME[nextType]);
  }

  function handleFileChange(file: File | null) {
    if (!file) return;
    const { base, extension } = splitFileName(file.name);
    // The actual picked file's name is a better default than a generic type
    // label — it's what the driver will recognize later. No extension here:
    // that's tracked separately in fileMeta and shown alongside size.
    setName(base);
    setFileMeta({ extension, sizeLabel: formatFileSize(file.size) });
  }

  function handleRemoveFile(event: MouseEvent) {
    // Stops the click from bubbling to the FileButton's own trigger — this
    // button removes the file, it shouldn't also reopen the picker.
    event.stopPropagation();
    setFileMeta(null);
    setName(DOC_TYPE_DEFAULT_NAME[type]);
    resetFileRef.current?.();
  }

  return (
    <Modal
      opened={opened}
      onClose={() => { onClose(); reset(); }}
      fullScreen
      withCloseButton={false}
      // Same back-button + title header as ShipmentDetailsScreen and
      // DocumentViewerModal, instead of a close X — the back arrow IS
      // Cancel here, which is why the footer below only needs one button.
      title={
        <Group gap="sm" wrap="nowrap">
          <ActionIcon
            data-autofocus
            variant="default"
            size={48}
            radius="xl"
            bg="dark.6"
            style={{ border: "none" }}
            onClick={() => { onClose(); reset(); }}
          >
            <IconArrowLeft size={22} />
          </ActionIcon>
          <Text fw={800} size="xl">Add Document</Text>
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
          mih="100%" + flex:1 on the content block pins Add to the bottom
          even when there isn't enough content to push it there on its own. */}
      <Stack gap={4} mih="100%">
        {/* gap=32 between field groups — noticeably more breathing room
            than the page's usual 4/8px rhythm, since each group here is a
            distinct decision (type, name, file) rather than a tight
            related-fields cluster. */}
        <Stack gap={32} p={8} style={{ flex: 1 }}>
          <Stack gap="xs">
            <Text fw={700} px={8}>Document type</Text>
            {/* Theme's default size="lg" (from bigControlSizes) ships at
                50px via Mantine's --input-height var, which sets BOTH height
                and min-height — Button sidesteps this by pinning its own
                "lg" to exactly 48 via an explicit styles.root height (see
                tokens.ts), but that alone doesn't work here: min-height:
                50px from the var still wins over height: 48px inline.
                Overriding minHeight too is what actually lands Select at
                the same 48px as the Add button below. */}
            <Select
              data={DOC_TYPES}
              value={type}
              onChange={(value) => value && handleTypeChange(value)}
              allowDeselect={false}
              // Default maxDropdownHeight (220px) starts scrolling around 5
              // items at this row height — only 5 options total here, so a
              // generous ceiling just lets the dropdown grow to fit all of
              // them instead of scrolling.
              maxDropdownHeight={400}
              // Default Popover offset lands the dropdown 5px below the
              // field, on top of which this value adds/subtracts further
              // (offset: -1 measured out to a 4px box-to-box gap). But the
              // focused field's own orange glow ring visually eats a few px
              // past its layout box, so a 4px gap read as flush/touching on
              // screen — offset: 2 (~7-8px real gap) is what actually reads
              // as a visible, separated gap once that glow is accounted for.
              comboboxProps={{ offset: 4 }}
              styles={{ input: { height: 48, minHeight: 48 } }}
            />
          </Stack>

          <Stack gap="xs">
            <Text fw={700} px={8}>Attach file</Text>

            {/* One Card shape throughout, both pinned to the same height
                (ATTACH_CARD_HEIGHT) — dashed/signal before, solid/green
                after — so picking a file reads as that same card changing
                state, not a button being swapped out for an unrelated,
                differently-sized component. Same before/after pattern as
                CompleteDeliveryModal's POD photo card. FileButton wraps a
                real (hidden) file input; its picked file is what fills
                Document name below. */}
            <FileButton resetRef={resetFileRef} onChange={handleFileChange} accept="image/*,.pdf">
              {(props) => (
                <Card
                  padding="md"
                  radius={CARD_RADIUS}
                  h={ATTACH_CARD_HEIGHT}
                  style={{
                    cursor: "pointer",
                    border: fileMeta
                      ? "1px solid var(--mantine-color-dark-4)"
                      : "2px dashed var(--mantine-color-signal-4)",
                  }}
                  {...props}
                >
                  {fileMeta ? (
                    <Group justify="space-between" wrap="nowrap" h="100%">
                      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                        <IconPaperclip size={20} color="var(--mantine-color-green-6)" />
                        <Stack gap={0} style={{ minWidth: 0 }}>
                          <Text fw={600} truncate>{name}</Text>
                          <Text size="sm" c="dimmed">{fileMeta.extension} · {fileMeta.sizeLabel}</Text>
                        </Stack>
                      </Group>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        radius="xl"
                        onClick={handleRemoveFile}
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

          {/* Name has nothing to default to before a file exists — no point
              showing an editable field with no subject yet. Collapse eases
              it in once picked, instead of the layout jumping. */}
          <Collapse expanded={fileMeta !== null}>
            <Stack gap="xs">
              <Text fw={700} px={8}>Document name</Text>
              <TextInput value={name} onChange={(event) => setName(event.currentTarget.value)} />
            </Stack>
          </Collapse>
        </Stack>

        {/* Just Add now — Cancel moved up into the back button. */}
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
            disabled={!fileMeta}
            leftSection={<IconPlus size={18} />}
            onClick={() => {
              // The name field itself stays extension-free (that's the
              // format detail fileMeta tracks separately) — the extension
              // is reattached here so the stored document still has a real
              // filename, matching every other entry in the documents list.
              const fullName = fileMeta ? `${name}.${fileMeta.extension.toLowerCase()}` : name;
              onUpload(type, fullName);
              reset();
            }}
          >
            Add
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default AddDocumentModal;
