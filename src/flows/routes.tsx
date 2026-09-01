// src/flows/routes.tsx
//
// DESIGNER-OWNED. The declarative route tree: structure and navigation only.
// There is deliberately no `loader` or `guard` field — there's nowhere to put
// logic, which is what keeps this folder safe to own.
//
// /app/router.tsx consumes this tree generically and builds the real router
// from it. Adding a screen = drop a component in src/flows/<name>/ and add an
// entry here. You never touch /app.
//
// Param syntax is `:id` (readable). The bridge in /app translates it to
// TanStack's `$id` — don't write `$id` here.

import type { ComponentType } from "react";
import HomeScreen from "./home/HomeScreen";
import ShipmentsScreen from "./shipments/ShipmentsScreen";
import ShipmentDetailsScreen from "./shipments/shipment-details/ShipmentDetailsScreen";
import MessagesScreen from "./messages/MessagesScreen";
import DocumentsScreen from "./documents/DocumentsScreen";
import ProfileScreen from "./profile/ProfileScreen";

export type FlowRoute = {
  /** "/" | "loans" | ":id". Nested under the parent's path. */
  path: string;
  /** The screen. Omit on a node that exists purely to group children. */
  component?: ComponentType;
  children?: FlowRoute[];
  /**
   * Design annotation ONLY — grouping/labels for the DevBar and the Flow Map.
   * NOT enforcement: `meta.role: "admin"` restricts nothing.
   * Real role guards are dev's, in /app.
   */
  meta?: {
    role?: string;
    flow?: string;
    label?: string;
    /** Sample values so detail routes are clickable, e.g. { id: "1001" }. */
    sampleParams?: Record<string, string>;
  };
};

export const routes: FlowRoute[] = [
  {
    path: "/",
    component: HomeScreen,
    meta: { role: "driver", flow: "Driver App", label: "Home" },
  },
  {
    path: "shipments",
    component: ShipmentsScreen,
    meta: { role: "driver", flow: "Driver App", label: "Shipments" },
    children: [
      {
        path: ":id",
        component: ShipmentDetailsScreen,
        meta: {
          role: "driver", flow: "Driver App", label: "Shipment details",
          sampleParams: { id: "HC-9284471" },
        },
      },
    ],
  },
  {
    path: "messages",
    component: MessagesScreen,
    meta: { role: "driver", flow: "Driver App", label: "Messages" },
  },
  {
    path: "documents",
    component: DocumentsScreen,
    meta: { role: "driver", flow: "Driver App", label: "Documents" },
  },
  {
    path: "profile",
    component: ProfileScreen,
    meta: { role: "driver", flow: "Driver App", label: "Profile" },
  },
];
