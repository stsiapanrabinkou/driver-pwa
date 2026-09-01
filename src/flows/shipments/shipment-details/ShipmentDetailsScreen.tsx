import { useEffect, useRef, useState, type RefObject } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  ActionIcon, Button, Card, Group, Stack, Tabs, Text, Timeline, useMantineTheme,
} from "@mantine/core";
import {
  IconAlertTriangleFilled, IconArrowLeft, IconCheck, IconFileTextFilled, IconPlus, IconChevronRight,
} from "@tabler/icons-react";
import { AppScreen } from "../../../shared/ui/AppScreen/AppScreen";
import { BottomNav } from "../../../shared/ui/BottomNav/BottomNav";
import { RouteAddresses } from "../../../shared/ui/RouteAddresses/RouteAddresses";
import { mockShipments } from "../../../shared/ui/ShipmentCard/mockShipments";
import { ShipmentProgressBar } from "../../../shared/ui/ShipmentProgressBar/ShipmentProgressBar";
import { StatusBadge, type ShipmentStage } from "../../../shared/ui/StatusBadge/StatusBadge";
import { STAGE_PROGRESS } from "../../../shared/ui/StatusBadge/shipmentStage";
import { SyncStatusBar } from "../../../shared/ui/SyncStatusBar/SyncStatusBar";
import { mockPendingSync } from "../../../shared/ui/SyncStatusBar/mockPendingSync";
import { getStyles } from "./ShipmentDetailsScreen.styles";
import { ConfirmSheet } from "./ConfirmSheet";
import { ReportIssueModal, type IssueReason } from "./ReportIssueModal";
import { CompleteDeliveryModal, type CompleteDeliveryResult, type ReturnReason } from "./CompleteDeliveryModal";
import { AddDocumentModal, type DocumentType } from "./AddDocumentModal";
import { DocumentViewerModal } from "./DocumentViewerModal";
import type { ShipmentDocument } from "./documents";

// Same entity Home's active-shipments list renders — looked up by id here
// instead of iterated, so the address/dates can never drift between the two
// screens. The flow's stage/isDelayed are simulated locally below (this
// screen always starts a demo run from "planned"), so only the static
// from/to/placed/due fields are pulled from the shared mock.
const SHIPMENTS_BY_ID = Object.fromEntries(mockShipments.map((s) => [s.id, s]));

const CTA_LABEL: Record<ShipmentStage, string> = {
  planned: "Start Shipment",
  en_route_to_pickup: "Arrived at Pickup",
  loading: "Departed from Pickup",
  in_transit: "Arrived at Destination",
  unloading: "Complete Delivery",
  delivered: "Back to Home",
  returned: "Back to Home",
};

const ORDERED_MILESTONE_LABELS = [
  "Shipment started", "Arrived at pickup", "Departed from pickup", "Arrived at destination", "Delivered",
];

const ISSUE_REASON_LABEL: Record<IssueReason, string> = {
  traffic: "Traffic", weather: "Weather", mechanical: "Mechanical",
  customer: "Customer", detention: "Detention", other: "Other",
};

const RETURN_REASON_LABEL: Record<ReturnReason, string> = {
  recipient_refused: "Recipient refused", address_not_found: "Address not found",
  damaged_goods: "Damaged goods", other: "Other",
};

const DOC_TYPE_LABEL: Record<DocumentType, string> = {
  proof_of_delivery: "Proof of Delivery", delivery_receipt: "Delivery Receipt",
  signed_document: "Signed Document", damage_photo: "Damage Photo", other: "Other",
};

interface TimelineEntry {
  id: string;
  label: string;
  timestamp: string;
  tone: "default" | "delay" | "success";
}

function nowLabel() {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return `Today, ${time}`;
}

export function ShipmentDetailsScreen() {
  const theme = useMantineTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const shipmentId = id ?? "HC-9284471";
  const shipment = SHIPMENTS_BY_ID[shipmentId] ?? SHIPMENTS_BY_ID["HC-9284471"];

  const [stage, setStage] = useState<ShipmentStage>("planned");
  const [isDelayed, setIsDelayed] = useState(false);
  const [deliveredAt, setDeliveredAt] = useState<string | null>(null);
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([
    { id: "planned", label: "Shipment planned", timestamp: "Yesterday, 16:00", tone: "default" },
  ]);
  const [activeTab, setActiveTab] = useState<string | null>("timeline");
  const [documents, setDocuments] = useState<ShipmentDocument[]>([
    { id: "doc-bol", name: "Bill of lading.pdf", timestamp: "Yesterday, 16:00", uploadedBy: "Dispatch", type: "other" },
  ]);
  const [viewingDoc, setViewingDoc] = useState<ShipmentDocument | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Measures the header block, the sticky tabs row, and the footer CTA bar
  // live — the same way SyncStatusBar measures itself for --syncbar-height —
  // so the Tabs.Panel below can size itself to exactly the space between
  // them (see panelScrollArea) no matter how any of the three change (font,
  // padding, a future extra row, ...), instead of a guessed value.
  //
  // (Tried letting the panel just grow with the page — sticky elements
  // don't reserve real flow space where they visually sit, so once the tabs
  // were docked, list rows scrolling past would paint underneath them
  // before the page-level scroll caught up: fine for one short entry, ugly
  // for a longer history. panelScrollArea instead caps this to a fixed pane
  // that scrolls internally, so content never has to pass behind the tabs.)
  useEffect(() => {
    const targets: [RefObject<HTMLDivElement | null>, string][] = [
      [headerRef, "--shipment-header-height"],
      [tabsListRef, "--shipment-tabslist-height"],
      [footerRef, "--shipment-footer-height"],
    ];
    const observers = targets.map(([ref, varName]) => {
      const el = ref.current;
      if (!el) return null;
      const observer = new ResizeObserver(([entry]) => {
        document.documentElement.style.setProperty(varName, `${(entry.target as HTMLElement).offsetHeight}px`);
      });
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  // One confirm sheet, reused for every stage advance — each transition
  // just describes its own question/label instead of needing its own
  // disclosure + ConfirmSheet block.
  const [pendingAdvance, setPendingAdvance] = useState<
    { next: ShipmentStage; label: string; question: string; confirmLabel: string } | null
  >(null);
  const [reportIssue, reportIssueHandlers] = useDisclosure(false);
  const [completeDelivery, completeDeliveryHandlers] = useDisclosure(false);
  const [addDocument, addDocumentHandlers] = useDisclosure(false);

  function logEvent(label: string, tone: TimelineEntry["tone"] = "default") {
    setTimelineEntries((prev) => [...prev, { id: `${prev.length}-${label}`, label, timestamp: nowLabel(), tone }]);
  }

  function advance(next: ShipmentStage, label: string) {
    setStage(next);
    logEvent(label);
    setMilestoneCount((c) => c + 1);
  }

  function handlePrimaryAction() {
    switch (stage) {
      case "planned":
        setPendingAdvance({
          next: "en_route_to_pickup", label: "Shipment started",
          question: `Start delivery ${shipmentId}?`, confirmLabel: "Start",
        });
        break;
      case "en_route_to_pickup":
        setPendingAdvance({
          next: "loading", label: "Arrived at pickup",
          question: "Confirm arrival at pickup?", confirmLabel: "Confirm",
        });
        break;
      case "loading":
        setPendingAdvance({
          next: "in_transit", label: "Departed from pickup",
          question: "Confirm departure from pickup?", confirmLabel: "Confirm",
        });
        break;
      case "in_transit":
        setPendingAdvance({
          next: "unloading", label: "Arrived at destination",
          question: "Confirm arrival at destination?", confirmLabel: "Confirm",
        });
        break;
      case "unloading":
        completeDeliveryHandlers.open();
        break;
      case "delivered":
      case "returned":
        navigate({ to: "/" });
        break;
    }
  }

  function handleCompleteDelivery(result: CompleteDeliveryResult) {
    const time = nowLabel();
    if (result.outcome === "delivered") {
      setStage("delivered");
      setDeliveredAt(time);
      logEvent("Delivered", "success");
      setMilestoneCount(5 + 1);
      setDocuments((prev) => [
        { id: "doc-signature", name: "Signature.png", timestamp: time, uploadedBy: "You", type: "signed_document" },
        { id: "doc-pod", name: "POD photo.jpg", timestamp: time, uploadedBy: "You", type: "proof_of_delivery" },
        ...prev,
      ]);
      notifications.show({ color: "green", message: "Delivery completed" });
    } else {
      setStage("returned");
      logEvent(`Returned: ${RETURN_REASON_LABEL[result.returnReason ?? "other"]}`);
      setMilestoneCount(5 + 1);
      notifications.show({ color: "orange", message: "Shipment marked as returned" });
    }
    completeDeliveryHandlers.close();
  }

  function handleReportIssue(reason: IssueReason, notes: string) {
    setIsDelayed(true);
    logEvent(`Delay reported: ${ISSUE_REASON_LABEL[reason]}`, "delay");
    console.log("issue notes", notes);
    notifications.show({ color: "orange", message: "Issue reported" });
    reportIssueHandlers.close();
  }

  function handleAddDocument(type: DocumentType, name: string) {
    setDocuments((prev) => [
      { id: `doc-${prev.length}-${type}`, name, timestamp: nowLabel(), uploadedBy: "You", type },
      ...prev,
    ]);
    addDocumentHandlers.close();
  }

  const isFinal = stage === "delivered" || stage === "returned";
  const dueColor = isDelayed && !isFinal ? "orange" : stage === "unloading" ? "green" : undefined;
  const pendingLabels =
    milestoneCount === 1 ? ["Not started yet"] : ORDERED_MILESTONE_LABELS.slice(milestoneCount - 1);

  return (
    <AppScreen
      header={
        <Stack gap={0} ref={headerRef}>
          <SyncStatusBar pendingItems={mockPendingSync} onRetry={() => console.log("retry sync")} />
          <Group justify="space-between" pl={8} pr={16} py="md">
            <Group gap="sm">
              <ActionIcon
                variant="default"
                size={48}
                radius="xl"
                bg="dark.6"
                style={{ border: "none" }}
                onClick={() => navigate({ to: "/" })}
              >
                <IconArrowLeft size={22} />
              </ActionIcon>
              <Text fw={800} size="xl">{shipmentId}</Text>
            </Group>
            <StatusBadge stage={stage} isDelayed={isDelayed} />
          </Group>
        </Stack>
      }
      footer={
        <div ref={footerRef} style={styles.footer}>
          <div style={styles.footerCta}>
            <Button fullWidth onClick={handlePrimaryAction}>
              {CTA_LABEL[stage]}
            </Button>
          </div>
          <BottomNav />
        </div>
      }
    >
      <Stack gap={4} p={8}>
        <Card padding={8}>
          <Stack gap={16}>
            <Stack gap={16} p={16}>
              <RouteAddresses from={shipment.from} to={shipment.to} />

              <Group grow align="flex-start" gap={32}>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" fw={600}>Placed</Text>
                  <Text size="sm" fw={600}>{shipment.placedLabel}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" fw={600}>
                    {isFinal && stage === "delivered" ? "Delivered at" : "Due by"}
                  </Text>
                  <Text size="sm" fw={600} c={dueColor}>
                    {isFinal && stage === "delivered" ? deliveredAt : shipment.dueLabel}
                  </Text>
                </Stack>
              </Group>

              <ShipmentProgressBar
                value={STAGE_PROGRESS[stage]}
                color={isDelayed && !isFinal ? "orange" : "signal"}
              />
            </Stack>

            <Button
              variant="default"
              leftSection={<IconAlertTriangleFilled size={22} color="var(--mantine-color-orange-5)" />}
              onClick={reportIssueHandlers.open}
            >
              Report an Issue
            </Button>
          </Stack>
        </Card>

        <Tabs value={activeTab} onChange={setActiveTab} mt={32}>
          <Tabs.List grow ref={tabsListRef} style={styles.stickyTabsList}>
            <Tabs.Tab value="timeline" h={48}>
              <Text size="19px" fw={activeTab === "timeline" ? 700 : 500} c={activeTab === "timeline" ? undefined : "dimmed"} ta="center">
                Timeline
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="documents" h={48}>
              <Text size="19px" fw={activeTab === "documents" ? 700 : 500} c={activeTab === "documents" ? undefined : "dimmed"} ta="center">
                Documents
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="timeline" pt={32} px={8} style={styles.panelScrollArea}>
            {/* Mantine treats `active` as an index ("active >= index"), not a
                count — passing the entry count marked one pending item past
                the real history as active too (identical white bullet). */}
            <Timeline active={timelineEntries.length - 1} bulletSize={22} lineWidth={2}>
              {timelineEntries.map((entry) => (
                <Timeline.Item
                  key={entry.id}
                  color={entry.tone === "delay" ? undefined : "green"}
                  bullet={
                    entry.tone === "delay"
                      ? <IconAlertTriangleFilled size={12} />
                      : <IconCheck size={13} stroke={4} color="var(--mantine-color-dark-7)" />
                  }
                  // Mantine's active bullet always forces a white fill (see
                  // node_modules/@mantine/core/styles/Timeline.css) — the
                  // `color` prop above only reaches the border, so the fill
                  // needs its own override to actually read as "done".
                  styles={entry.tone === "delay" ? undefined : {
                    itemBullet: { backgroundColor: "var(--mantine-color-green-6)" },
                  }}
                  title={
                    <Text fw={700} c={entry.tone === "delay" ? "orange" : entry.tone === "success" ? "green" : undefined}>
                      {entry.label}
                    </Text>
                  }
                >
                  <Text size="sm" c="dimmed">{entry.timestamp}</Text>
                </Timeline.Item>
              ))}
              {pendingLabels.map((label) => (
                <Timeline.Item key={label} color="gray" title={<Text c="dimmed">{label}</Text>} />
              ))}
            </Timeline>
          </Tabs.Panel>

          <Tabs.Panel value="documents" pt={32} style={styles.panelScrollArea}>
            <Stack gap={4}>
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  padding="md"
                  onClick={() => setViewingDoc(doc)}
                  style={{ cursor: "pointer" }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                      <IconFileTextFilled size={20} />
                      <Stack gap={0}>
                        <Text fw={600}>{doc.name}</Text>
                        <Text size="sm" c="dimmed">{doc.timestamp} · {DOC_TYPE_LABEL[doc.type]}</Text>
                      </Stack>
                    </Group>
                    <IconChevronRight size={16} />
                  </Group>
                </Card>
              ))}

              <Card
                padding="md"
                onClick={addDocumentHandlers.open}
                style={{ cursor: "pointer", border: "2px dashed var(--mantine-color-signal-4)" }}
              >
                {/* Same icon + title/subtitle shape as the attached-document
                    row above — matches its height naturally (real second
                    line, not a min-height hack) and keeps the icon on the
                    same left baseline instead of a centered single line. */}
                <Group gap="sm" wrap="nowrap">
                  <IconPlus size={20} color="var(--mantine-color-signal-6)" />
                  <Stack gap={0}>
                    <Text fw={600} c="signal">Add document</Text>
                    <Text size="sm" c="dimmed">PDF, JPG, PNG · up to 10 MB</Text>
                  </Stack>
                </Group>
              </Card>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <ConfirmSheet
        opened={pendingAdvance !== null}
        onClose={() => setPendingAdvance(null)}
        question={pendingAdvance?.question ?? ""}
        confirmLabel={pendingAdvance?.confirmLabel ?? "Confirm"}
        onConfirm={() => {
          if (pendingAdvance) advance(pendingAdvance.next, pendingAdvance.label);
        }}
      />
      <ReportIssueModal
        opened={reportIssue}
        onClose={reportIssueHandlers.close}
        shipmentId={shipmentId}
        from={shipment.from}
        to={shipment.to}
        onSubmit={handleReportIssue}
      />
      <CompleteDeliveryModal
        opened={completeDelivery}
        onClose={completeDeliveryHandlers.close}
        onSubmit={handleCompleteDelivery}
      />
      <AddDocumentModal
        opened={addDocument}
        onClose={addDocumentHandlers.close}
        onUpload={handleAddDocument}
      />
      <DocumentViewerModal
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        shipmentId={shipmentId}
      />
    </AppScreen>
  );
}

export default ShipmentDetailsScreen;
