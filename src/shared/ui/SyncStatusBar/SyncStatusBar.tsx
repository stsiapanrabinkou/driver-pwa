import { useEffect, useRef } from "react";
import { Box, Button, Collapse, Group, Loader, ScrollArea, Stack, Text, ThemeIcon, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertTriangleFilled, IconCameraFilled, IconChevronDown, IconChevronUp, IconRefresh,
  IconTruckFilled, IconWifi, IconWifiOff,
} from "@tabler/icons-react";
import { getStyles } from "./SyncStatusBar.styles";

export interface PendingSyncItem {
  id: string;
  kind: "photo" | "delay" | "status";
  title: string;
  subtitle: string;
  timestamp: string;
}

export interface SyncStatusBarProps {
  pendingItems: PendingSyncItem[];
  /** Offline can only queue changes; online actively syncs them (the
   * "syncing" sub-state below is just online + pending items). */
  connection?: "offline" | "online";
  onRetry?: () => void;
}

const KIND_ICON = {
  photo: IconCameraFilled,
  delay: IconAlertTriangleFilled,
  status: IconTruckFilled,
};

export function SyncStatusBar({ pendingItems, connection = "offline", onRetry }: SyncStatusBarProps) {
  const theme = useMantineTheme();
  const styles = getStyles(theme);
  const [opened, { toggle, close }] = useDisclosure(false);
  const count = pendingItems.length;
  const barRef = useRef<HTMLDivElement>(null);
  const isOnline = connection === "online";
  // Online + still-queued items IS the "syncing" state — there's no separate
  // flag for it, it's just what online with a non-empty queue means.
  const isSyncing = isOnline && count > 0;
  const statusColor = isOnline ? "green" : "red";

  // Exposed so AppScreen's sticky header (and anything docking under it, like
  // Home's "Active shipments" title) can read this bar's real rendered
  // height instead of a guessed pixel value — stays correct if padding,
  // font size, or content here ever changes. A live ResizeObserver (not a
  // one-off measurement) matters here: the very first layout pass can land
  // before the web font finishes loading, measuring the fallback font's
  // metrics instead of the real ones — this keeps correcting itself as the
  // box's actual size settles.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      // offsetHeight, not contentRect (content-box only, excludes the p="md"
      // padding) — the sticky title docks below the full border-box.
      document.documentElement.style.setProperty("--syncbar-height", `${(entry.target as HTMLElement).offsetHeight}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box style={styles.root}>
      {/* Swallows the first tap outside the panel instead of letting it also
          land on whatever's underneath — a bare click-outside listener fires
          alongside the covered element's own handler, so e.g. tapping a nav
          item to close the panel would also navigate. */}
      {opened && <Box style={styles.backdrop} onClick={close} />}

      <Group
        ref={barRef}
        justify="space-between"
        p="md"
        style={styles.bar}
        onClick={count > 0 ? toggle : undefined}
      >
        <Group gap={6}>
          {isOnline ? (
            <IconWifi size={18} color={`var(--mantine-color-${statusColor}-5)`} />
          ) : (
            <IconWifiOff size={18} color={`var(--mantine-color-${statusColor}-5)`} />
          )}
          <Text c={`${statusColor}.5`}>{isOnline ? "Online" : "Offline"}</Text>
        </Group>
        {count > 0 ? (
          <Group gap={6}>
            <Text c="dimmed" size="sm">
              {isSyncing ? `Syncing ${count} items…` : `${count} items not synced`}
            </Text>
            {isSyncing && <Loader size={14} color={statusColor} />}
            {opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </Group>
        ) : (
          <Text c="dimmed" size="sm">
            All synced
          </Text>
        )}
      </Group>

      <Collapse expanded={opened} style={styles.panel}>
        <Group justify="space-between" p="md" pb="lg">
          <Text fw={700}>
            {isSyncing ? `Syncing ${count} items…` : `${count} changes pending sync`}
          </Text>
          {/* Retry only makes sense offline — while online, the queue is
              already actively syncing on its own. */}
          {!isOnline && (
            <Button
              size="sm"
              variant="default"
              radius="xl"
              leftSection={<IconRefresh size={16} />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </Group>

        {/* mah fits exactly 7 rows (48px row + 12px gap each) before scrolling kicks in. */}
        <ScrollArea.Autosize mah={413} type="auto" offsetScrollbars>
          <Stack gap="sm" px="md" pb="md">
            {pendingItems.map((item) => {
              const Icon = KIND_ICON[item.kind];
              return (
                <Group key={item.id} justify="space-between" wrap="nowrap" align="flex-start">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon variant="default" size="lg" radius="md" style={styles.itemIcon}>
                      <Icon size={18} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text fw={600}>{item.title}</Text>
                      <Text size="sm" c="dimmed">
                        {item.subtitle}
                      </Text>
                    </Stack>
                  </Group>
                  <Text size="sm" c="dimmed" style={styles.itemTimestamp}>
                    {item.timestamp}
                  </Text>
                </Group>
              );
            })}
          </Stack>
        </ScrollArea.Autosize>
      </Collapse>
    </Box>
  );
}

export default SyncStatusBar;
