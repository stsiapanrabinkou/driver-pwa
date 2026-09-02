// Shipment Details — no route param means it falls back to its own mock
// shipment (HC-9284471), and the whole stage progression (planned →
// delivered/returned) is a self-contained local simulation. Same story as
// Shipments: there's nothing to wire via Controls because the screen's own
// CTA button, tabs, and confirm sheets already are the controls — click
// through the flow directly in the canvas to see every stage, the two
// tabs, and every modal it opens.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@mantine/core";
import {
  RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter,
} from "@tanstack/react-router";
import { ShipmentDetailsScreen } from "./ShipmentDetailsScreen";

function PhoneViewport({ children }: { children: React.ReactNode }) {
  return (
    <Box style={{ maxWidth: 480, height: 900, margin: "0 auto", overflow: "auto" }}>
      {children}
    </Box>
  );
}

// Unlike useNavigate (tolerant when rendered outside a router — see
// Screens/Home and Screens/Shipments), useParams throws synchronously with
// no RouterContext to read from. This is a Storybook-only memory router
// scoped to exactly the one route this screen needs — not the real router
// (that stays entirely in /app, see AGENTS.md §5) — just enough context for
// useParams({ strict: false }) to resolve "HC-9284471" instead of crashing.
const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipments/$id",
  component: ShipmentDetailsScreen,
});
const routeTree = rootRoute.addChildren([detailRoute]);

function StoryRouter() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/shipments/HC-9284471"] }),
  });
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof ShipmentDetailsScreen> = {
  title: "Screens/Shipment Details",
  decorators: [(Story) => <PhoneViewport><Story /></PhoneViewport>],
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Default: StoryObj<typeof ShipmentDetailsScreen> = {
  render: () => <StoryRouter />,
};
