import type { ShipmentCardProps } from "./ShipmentCard";

export type ShipmentMock = Omit<ShipmentCardProps, "onClick"> & {
  /** ISO-ish sort key, not displayed — dueLabel is the friendly string
   * ("Today, 14:00", "Wed, Aug 14, 09:00") and isn't chronologically
   * sortable on its own. Only this field's ordering matters, not its format. */
  dueAt: string;
};

// Shared across Home's active-shipments list, the Shipments tab (search /
// filter / sort over the full list), AND Shipment Details (looked up by id)
// — one entity, so the full address/dates never drift between screens.
// Home filters this down to non-final stages for its own list; the
// Shipments tab shows all of it.
export const mockShipments: ShipmentMock[] = [
  {
    id: "HC-4821",
    from: "Av. Paseo de la Reforma 222, Ciudad de México, CDMX",
    to: "Av. Universidad 1858, Ciudad de México, CDMX",
    placedLabel: "Aug 12, 2026",
    dueLabel: "Today, 14:00", dueAt: "2026-08-13T14:00", dueColor: "orange", stage: "in_transit", isDelayed: true,
  },
  {
    id: "HC-4822",
    from: "Calz. Ignacio Zaragoza 15, Ciudad de México, CDMX",
    to: "Av. Insurgentes Sur 900, Ciudad de México, CDMX",
    placedLabel: "Aug 12, 2026",
    dueLabel: "Today, 15:30", dueAt: "2026-08-13T15:30", stage: "in_transit",
  },
  {
    id: "HC-9284471",
    from: "Blvd. M. Ávila Camacho 40, Toluca, Estado de México",
    to: "Calle F. I. Madero 12, Toluca, Estado de México",
    placedLabel: "Aug 13, 2026",
    dueLabel: "Wed, Aug 14, 09:00", dueAt: "2026-08-14T09:00", stage: "planned",
  },
  // History — delivered / returned. Dated before the active shipments above
  // so a due-soonest sort naturally pushes them to the bottom.
  {
    id: "HC-4790",
    from: "Av. Chapultepec 480, Ciudad de México, CDMX",
    to: "Av. Revolución 1500, Ciudad de México, CDMX",
    placedLabel: "Aug 10, 2026",
    dueLabel: "Aug 11, 2026, 16:00", dueAt: "2026-08-11T16:00", stage: "delivered",
  },
  {
    id: "HC-4805",
    from: "Periférico Sur 4118, Ciudad de México, CDMX",
    to: "Av. Constituyentes 1000, Ciudad de México, CDMX",
    placedLabel: "Aug 11, 2026",
    dueLabel: "Aug 12, 2026, 11:00", dueAt: "2026-08-12T11:00", stage: "delivered",
  },
  {
    id: "HC-4788",
    from: "Calz. de Tlalpan 2001, Ciudad de México, CDMX",
    to: "Av. Río Churubusco 400, Ciudad de México, CDMX",
    placedLabel: "Aug 9, 2026",
    dueLabel: "Aug 10, 2026, 17:30", dueAt: "2026-08-10T17:30", stage: "returned",
  },
];
