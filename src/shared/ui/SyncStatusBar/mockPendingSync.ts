import type { PendingSyncItem } from "./SyncStatusBar";

// Shared across every tab screen (Home, Shipments, Messages, Documents,
// Profile) — the sync bar is cross-cutting, so all of them show the same
// pending queue rather than each screen inventing its own.
export const mockPendingSync: PendingSyncItem[] = [
  { id: "sync-1", kind: "photo", title: "HC-4819 · POD captured", subtitle: "Photo + signature", timestamp: "09:25" },
  { id: "sync-2", kind: "delay", title: "HC-4821 · Delay reported", subtitle: "Reason: Traffic", timestamp: "09:10" },
  { id: "sync-3", kind: "status", title: "HC-4822 · Status updated", subtitle: "In transit", timestamp: "08:52" },
  { id: "sync-4", kind: "photo", title: "HC-4823 · POD captured", subtitle: "Photo + signature", timestamp: "08:44" },
  { id: "sync-5", kind: "delay", title: "HC-4824 · Delay reported", subtitle: "Reason: Weather", timestamp: "08:30" },
  { id: "sync-6", kind: "status", title: "HC-4825 · Status updated", subtitle: "Delivered", timestamp: "08:12" },
  { id: "sync-7", kind: "photo", title: "HC-4826 · POD captured", subtitle: "Photo + signature", timestamp: "07:58" },
  { id: "sync-8", kind: "status", title: "HC-4827 · Status updated", subtitle: "In transit", timestamp: "07:40" },
  { id: "sync-9", kind: "delay", title: "HC-4828 · Delay reported", subtitle: "Reason: Traffic", timestamp: "07:22" },
  { id: "sync-10", kind: "photo", title: "HC-4829 · POD captured", subtitle: "Photo + signature", timestamp: "07:05" },
];
