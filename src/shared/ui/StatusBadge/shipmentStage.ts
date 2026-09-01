export type ShipmentStage =
  | "planned"
  | "en_route_to_pickup"
  | "loading"
  | "in_transit"
  | "unloading"
  | "delivered"
  | "returned";

export const STAGE_META: Record<ShipmentStage, { label: string; color: string }> = {
  planned: { label: "Planned", color: "gray" },
  en_route_to_pickup: { label: "En Route to Pickup", color: "blue" },
  loading: { label: "Loading", color: "blue" },
  in_transit: { label: "In Transit", color: "blue" },
  unloading: { label: "Unloading", color: "blue" },
  delivered: { label: "Delivered", color: "green" },
  returned: { label: "Returned", color: "red" },
};

// How far along the route each stage represents — drives the progress bar on
// ShipmentCard. Per WBS: "percent of the completed state, calculated
// according to the basic statuses percentage addition."
export const STAGE_PROGRESS: Record<ShipmentStage, number> = {
  planned: 0,
  en_route_to_pickup: 20,
  loading: 40,
  in_transit: 60,
  unloading: 85,
  delivered: 100,
  returned: 100,
};
