import { ActionIcon, Box, Group, Menu, Modal, ScrollArea, Stack, Text, ThemeIcon } from "@mantine/core";
import {
  IconArrowLeft, IconDots, IconDownload, IconEdit, IconFileText, IconPhoto, IconTrash,
} from "@tabler/icons-react";
import type { ShipmentDocument } from "./documents";

export interface DocumentViewerModalProps {
  document: ShipmentDocument | null;
  onClose: () => void;
  shipmentId: string;
}

const PDF_PAGE_COUNT = 3;

export function DocumentViewerModal({ document, onClose, shipmentId }: DocumentViewerModalProps) {
  const isPdf = document?.name.split(".").pop()?.toUpperCase() === "PDF";

  return (
    <Modal
      opened={document !== null}
      onClose={onClose}
      fullScreen
      withCloseButton={false}
      // Same back-button + title row as ShipmentDetailsScreen's own header,
      // not Mantine's default title bar (which has no room for the
      // timestamp/format line and only offers a plain X).
      title={
        document ? (
          <Group gap="sm" wrap="nowrap" style={{ width: "100%" }}>
            <ActionIcon
              variant="default"
              size={48}
              radius="xl"
              bg="dark.6"
              style={{ border: "none", flexShrink: 0 }}
              onClick={onClose}
            >
              <IconArrowLeft size={22} />
            </ActionIcon>
            {/* flex: 1 fills the space Mantine's title slot doesn't stretch
                into on its own (it's shrink-wrapped, not flex-grown), which
                is what was leaving the more button stranded next to the
                filename instead of pinned to the far corner. minWidth: 0
                lets it actually shrink below its text's intrinsic width so
                a long filename truncates instead of pushing the button out. */}
            <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
              <Text fw={800} size="xl" truncate>{document.name}</Text>
              <Text size="sm" c="dimmed">{document.timestamp}</Text>
            </Stack>

            <Menu
              position="bottom-end"
              withinPortal
              // Default Menu.Item is compact (14px, tight padding) — bumped
              // to match the rest of this screen's touch-target scale.
              // Dropdown radius (20) is deliberately a step above item
              // radius (16, the theme default left untouched) — the outer
              // shell reads as the bigger, containing shape.
              styles={{
                dropdown: { borderRadius: 20 },
                item: { fontSize: "var(--mantine-font-size-md)", padding: "12px 16px" },
                itemSection: { marginInlineEnd: 12 },
              }}
            >
              <Menu.Target>
                <ActionIcon variant="default" size={48} radius="xl" bg="dark.6" style={{ border: "none" }}>
                  <IconDots size={22} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconDownload size={20} />}
                  onClick={() => console.log("save to device", document.id)}
                >
                  Save to device
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEdit size={20} />}
                  onClick={() => console.log("rename", document.id)}
                >
                  Rename
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={20} />}
                  onClick={() => console.log("delete", document.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : null
      }
      styles={{
        // fullScreen's actual fixed, viewport-filling box is `inner` (`top:
        // 0, height: 100%`) — `content` itself is a static block inside it,
        // so offsetting `content` does nothing. `inner` sits BEHIND the
        // dev-only DevBar (fixed, zIndex 9999), which clipped the filename
        // row. Same --devbar-height offset AppScreen's own sticky header
        // already uses; 0px in production, where DevBar never mounts.
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
        // wider than that the modal box stopped short of the right edge —
        // the more button sat flush to ITS box, not the actual screen.
        content: {
          display: "flex", flexDirection: "column", height: "100%",
          width: "100%", maxWidth: "100%", margin: 0,
        },
        // Symmetric 8px left/right so the more button sits flush in the
        // corner, mirroring the back button on the other side.
        header: { padding: "var(--mantine-spacing-md) 8px" },
        // Modal's own title slot is shrink-wrapped, not flex-grown, which is
        // what let our title Group collapse to content width regardless of
        // its own width: 100%. flex: 1 here is the actual fix; the Stack's
        // flex: 1 above only works once this ancestor can grow to give it
        // room.
        title: { flex: 1, minWidth: 0 },
        body: { padding: 8, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" },
      }}
    >
      {document && (
        <Stack gap="lg" style={{ flex: 1, minHeight: 0 }}>
          {isPdf ? (
            <ScrollArea style={{ flex: 1 }} type="auto">
              <Stack gap={8}>
                {Array.from({ length: PDF_PAGE_COUNT }, (_, index) => (
                  <Box
                    key={index}
                    style={{
                      aspectRatio: "3 / 4",
                      borderRadius: "var(--mantine-radius-md)",
                      backgroundColor: "var(--mantine-color-dark-8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ThemeIcon variant="subtle" size={64} radius="md">
                      <IconFileText size={36} />
                    </ThemeIcon>
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
          ) : (
            <Box
              style={{
                flex: 1,
                aspectRatio: "3 / 4",
                borderRadius: "var(--mantine-radius-md)",
                backgroundColor: "var(--mantine-color-dark-8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemeIcon variant="subtle" size={64} radius="md">
                <IconPhoto size={36} />
              </ThemeIcon>
            </Box>
          )}

          {/* body already carries 8px padding — 8 more here reaches 16px
              total from the screen edge. */}
          <Stack gap={4} px={8}>
            <Group justify="space-between">
              <Text c="dimmed">Uploaded by</Text>
              <Text fw={700}>{document.uploadedBy}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">Linked to</Text>
              <Text fw={700}>{shipmentId}</Text>
            </Group>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
}

export default DocumentViewerModal;
