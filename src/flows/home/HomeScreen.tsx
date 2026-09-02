import { useNavigate } from "@tanstack/react-router";
import {
  Badge, Button, Card, Center, Group, SimpleGrid, Stack, Text,
} from "@mantine/core";
import {
  IconAlertTriangleFilled, IconCircleCheckFilled, IconPackageOff, IconTruckFilled,
} from "@tabler/icons-react";
import { AppScreen } from "../../shared/ui/AppScreen/AppScreen";
import { BottomNav } from "../../shared/ui/BottomNav/BottomNav";
import { ShipmentCard } from "../../shared/ui/ShipmentCard/ShipmentCard";
import { mockShipments, type ShipmentMock } from "../../shared/ui/ShipmentCard/mockShipments";
import { ACTIVE_STAGES } from "../../shared/ui/StatusBadge/shipmentStage";
import { SyncStatusBar, type PendingSyncItem } from "../../shared/ui/SyncStatusBar/SyncStatusBar";
import { mockPendingSync } from "../../shared/ui/SyncStatusBar/mockPendingSync";
import { styles } from "./HomeScreen.styles";

// ---- inline mock data (Design Mode — Dev wires the real feed later) ----
const today = { weekday: "Aug 13, Tue", time: "09:41" };

// mockShipments is the full fleet (Shipments tab shows all of it) — Home
// only ever means the ones still in flight.
const DEFAULT_ACTIVE_SHIPMENTS = mockShipments.filter((s) => ACTIVE_STAGES.has(s.stage));

function buildStats(activeShipments: ShipmentMock[]) {
  return [
    { label: "Active", value: activeShipments.length, icon: IconTruckFilled, color: "blue" },
    {
      label: "Delayed",
      value: activeShipments.filter((s) => s.isDelayed).length,
      icon: IconAlertTriangleFilled,
      color: "yellow",
    },
    {
      label: "Delivered",
      value: mockShipments.filter((s) => s.stage === "delivered").length,
      icon: IconCircleCheckFilled,
      color: "green",
    },
  ];
}

export interface HomeScreenProps {
  /** Lets Storybook (Screens/Home) swap the sync bar between its states
   * without touching this component. Defaults to the real mock queue. */
  syncPendingItems?: PendingSyncItem[];
  /** Same idea for the sync bar's connection state — offline (default) or
   * online (auto-syncs the queue instead of waiting for Retry). */
  syncConnection?: "offline" | "online";
  /** Same idea for the active-shipments list — e.g. an empty array for the
   * "no active shipments" empty state. */
  activeShipments?: ShipmentMock[];
}

export function HomeScreen({
  syncPendingItems = mockPendingSync,
  syncConnection = "offline",
  activeShipments = DEFAULT_ACTIVE_SHIPMENTS,
}: HomeScreenProps = {}) {
  const navigate = useNavigate();
  const stats = buildStats(activeShipments);

  return (
    <AppScreen
      header={(
        <SyncStatusBar
          pendingItems={syncPendingItems}
          connection={syncConnection}
          onRetry={() => console.log("retry sync")}
        />
      )}
      footer={<BottomNav active="home" />}
    >
      {/* Bento: big tiles, tight gaps — one accent (signal orange), the
          shared dark.6/dark.7 tile-on-black surface from theme/tokens.ts. */}
      <Stack gap={4} p={8}>
        <Card padding="xl">
          <Stack gap={4}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={0} style={{ minWidth: 0 }}>
                <Text c="dimmed">Today</Text>
                <Text fw={700} size="lg" style={{ whiteSpace: "nowrap" }}>{today.weekday}</Text>
              </Stack>
              <Text fw={800} style={styles.heroTime}>{today.time}</Text>
            </Group>
          </Stack>
        </Card>

        <SimpleGrid cols={3} spacing={4}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} padding="md">
              <Stack gap={6}>
                <Text size="xs" c="dimmed">{label}</Text>
                <Group gap={8} align="center" wrap="nowrap">
                  <Icon size={22} color={`var(--mantine-color-${color}-6)`} />
                  <Text fw={800} size="xl" lh={1}>{value}</Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <Card padding={8} bg="alert.5">
          <Stack gap={16}>
            <Stack gap={4} p={16}>
              <Group justify="space-between" align="center" wrap="nowrap">
                <Text fw={700} size="lg" c="dark.9">HC-4821 route changed</Text>
                <Text size="sm" c="dark.7" style={{ whiteSpace: "nowrap" }}>09:32</Text>
              </Group>
              <Text size="sm" c="dark.7">
                New drop-off address confirmed by dispatch — Av. Universidad 1858, expect a short delay on arrival
              </Text>
            </Stack>
            <Button
              fullWidth
              variant="default"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                color: "var(--mantine-color-signal-9)",
              }}
              rightSection={<Badge circle color="signal">5</Badge>}
              onClick={() => console.log("view all alerts")}
            >
              View all alerts
            </Button>
          </Stack>
        </Card>

        <Stack gap={4} mt={32}>
          <Text fw={700} size="lg" px={8} style={styles.stickyShipmentsHeader}>Active shipments</Text>
          {activeShipments.length > 0 ? (
            <Stack gap={4}>
              {activeShipments.map((shipment) => (
                <ShipmentCard
                  key={shipment.id}
                  id={shipment.id}
                  from={shipment.from}
                  to={shipment.to}
                  placedLabel={shipment.placedLabel}
                  dueLabel={shipment.dueLabel}
                  dueColor={shipment.dueColor}
                  stage={shipment.stage}
                  isDelayed={shipment.isDelayed}
                  onClick={() => navigate({ to: `/shipments/${shipment.id}` })}
                />
              ))}
            </Stack>
          ) : (
            <Card padding="xl">
              <Center>
                <Stack align="center" gap={4}>
                  <IconPackageOff size={28} color="var(--mantine-color-dimmed)" />
                  <Text c="dimmed" fw={600}>No active shipments</Text>
                </Stack>
              </Center>
            </Card>
          )}
        </Stack>
      </Stack>
    </AppScreen>
  );
}

export default HomeScreen;
