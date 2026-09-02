import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Center, CloseButton, Group, Stack, Switch, Tabs, Text, TextInput,
} from "@mantine/core";
import { DatePickerInput, type DatesRangeValue } from "@mantine/dates";
import { IconCalendar, IconPackageOff, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import { AppScreen } from "../../shared/ui/AppScreen/AppScreen";
import { BottomNav } from "../../shared/ui/BottomNav/BottomNav";
import { ShipmentCard } from "../../shared/ui/ShipmentCard/ShipmentCard";
import { mockShipments, type ShipmentMock } from "../../shared/ui/ShipmentCard/mockShipments";
import { SyncStatusBar } from "../../shared/ui/SyncStatusBar/SyncStatusBar";
import { mockPendingSync } from "../../shared/ui/SyncStatusBar/mockPendingSync";

type TabValue = "today" | "upcoming" | "archived";

// The app's fictional "now" (matches Home's own "Today, Aug 13, Tue" mock) —
// splitting by date needs a fixed reference point, not the real device
// clock, since every other due/placed label in this demo is already pinned
// to this day.
const MOCK_TODAY_END = dayjs("2026-08-13").endOf("day");

function matchesQuery(s: ShipmentMock, q: string) {
  if (!q) return true;
  return s.id.toLowerCase().includes(q) || s.from.toLowerCase().includes(q) || s.to.toLowerCase().includes(q);
}

function matchesRange(s: ShipmentMock, range: DatesRangeValue) {
  const [start, end] = range;
  if (!start && !end) return true;
  const due = dayjs(s.dueAt);
  if (start && due.isBefore(dayjs(start), "day")) return false;
  if (end && due.isAfter(dayjs(end), "day")) return false;
  return true;
}

export function ShipmentsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabValue>("today");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<DatesRangeValue>([null, null]);
  const [delayedOnly, setDelayedOnly] = useState(false);

  const { today, upcoming, archived } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = mockShipments.filter((s) => matchesQuery(s, q) && matchesRange(s, range));
    const unresolved = filtered.filter((s) => s.stage !== "delivered" && s.stage !== "returned");
    return {
      // Due today or earlier — a stage like "planned" doesn't push a
      // same-day shipment out of here just because nothing's happened on it
      // yet; what matters is whether it needs doing today. Ascending so an
      // overdue one (the most urgent case) surfaces above the rest of today.
      today: unresolved
        .filter((s) => (!delayedOnly || s.isDelayed) && !dayjs(s.dueAt).isAfter(MOCK_TODAY_END))
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
      // Due after today — soonest of these first.
      upcoming: unresolved
        .filter((s) => dayjs(s.dueAt).isAfter(MOCK_TODAY_END))
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
      // Most-recently-resolved first — the order that matters when looking
      // back, opposite of the other two tabs' "what's coming up" order.
      archived: filtered
        .filter((s) => s.stage === "delivered" || s.stage === "returned")
        .sort((a, b) => b.dueAt.localeCompare(a.dueAt)),
    };
  }, [query, range, delayedOnly]);

  function renderList(list: ShipmentMock[], emptyLabel: string) {
    if (list.length === 0) {
      return (
        <Center py={64}>
          <Stack align="center" gap={8}>
            <IconPackageOff size={32} color="var(--mantine-color-dimmed)" />
            <Text c="dimmed" ta="center">{emptyLabel}</Text>
          </Stack>
        </Center>
      );
    }
    return (
      <Stack gap={4}>
        {list.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            {...shipment}
            onClick={() => navigate({ to: `/shipments/${shipment.id}` })}
          />
        ))}
      </Stack>
    );
  }

  return (
    // Tabs wraps the whole screen (not just the visible tab strip) so
    // Tabs.List can live in AppScreen's static header — always visible,
    // never scrolls away — while Tabs.Panel content sits in the scrollable
    // body. They only need to share this one React context, not be DOM
    // neighbors.
    <Tabs value={tab} onChange={(value) => value && setTab(value as TabValue)} keepMounted={false}>
      <AppScreen
        header={(
          <Stack gap={12} pb={0}>
            <SyncStatusBar pendingItems={mockPendingSync} onRetry={() => console.log("retry sync")} />
            <Stack gap={12} px={8} pt={8}>
              <TextInput
                placeholder="Search by ID or address"
                leftSection={<IconSearch size={18} />}
                rightSection={query ? <CloseButton onClick={() => setQuery("")} /> : undefined}
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
              <DatePickerInput
                type="range"
                placeholder="Due date range"
                leftSection={<IconCalendar size={18} />}
                value={range}
                onChange={setRange}
                clearable
              />
            </Stack>
            {/* mx, not px — px insets the tabs but leaves the list's own
                border-bottom (the underline separator) spanning full width;
                margin insets the whole box, separator included. */}
            <Tabs.List grow mx={8}>
              <Tabs.Tab value="today" h={48}>
                <Text size="17px" fw={tab === "today" ? 700 : 500} c={tab === "today" ? undefined : "dimmed"}>
                  Today
                </Text>
              </Tabs.Tab>
              <Tabs.Tab value="upcoming" h={48}>
                <Text size="17px" fw={tab === "upcoming" ? 700 : 500} c={tab === "upcoming" ? undefined : "dimmed"}>
                  Upcoming
                </Text>
              </Tabs.Tab>
              <Tabs.Tab value="archived" h={48}>
                <Text size="17px" fw={tab === "archived" ? 700 : 500} c={tab === "archived" ? undefined : "dimmed"}>
                  Archived
                </Text>
              </Tabs.Tab>
            </Tabs.List>
          </Stack>
        )}
        footer={<BottomNav active="shipments" />}
      >
        <Tabs.Panel value="today" p={8}>
          <Group px={8} mt={8} mb={20}>
            <Switch
              checked={delayedOnly}
              onChange={(event) => setDelayedOnly(event.currentTarget.checked)}
              color="orange"
              label="Delayed only"
            />
          </Group>
          {renderList(today, "Nothing due today")}
        </Tabs.Panel>
        <Tabs.Panel value="upcoming" p={8}>
          {renderList(upcoming, "Nothing scheduled yet")}
        </Tabs.Panel>
        <Tabs.Panel value="archived" p={8}>
          {renderList(archived, "No delivered or returned shipments yet")}
        </Tabs.Panel>
      </AppScreen>
    </Tabs>
  );
}

export default ShipmentsScreen;
