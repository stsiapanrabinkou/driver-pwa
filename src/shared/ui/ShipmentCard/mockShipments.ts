import type { ShipmentCardProps } from "./ShipmentCard";

export type ShipmentMock = Omit<ShipmentCardProps, "onClick">;

// Shared across Home's active-shipments list AND Shipment Details (looked up
// by id) — one entity, so the full address/dates never drift between the
// list view and the detail view.
export const mockShipments: ShipmentMock[] = [
  {
    id: "HC-4821",
    from: "Av. Paseo de la Reforma 222, Ciudad de México, CDMX",
    to: "Av. Universidad 1858, Ciudad de México, CDMX",
    placedLabel: "Aug 12, 2026",
    dueLabel: "Today, 14:00", dueColor: "orange", stage: "in_transit", isDelayed: true,
  },
  {
    id: "HC-4822",
    from: "Calz. Ignacio Zaragoza 15, Ciudad de México, CDMX",
    to: "Av. Insurgentes Sur 900, Ciudad de México, CDMX",
    placedLabel: "Aug 12, 2026",
    dueLabel: "Today, 15:30", stage: "in_transit",
  },
  {
    id: "HC-9284471",
    from: "Blvd. M. Ávila Camacho 40, Toluca, Estado de México",
    to: "Calle F. I. Madero 12, Toluca, Estado de México",
    placedLabel: "Aug 13, 2026",
    dueLabel: "Wed, Aug 14, 09:00", stage: "planned",
  },
];
