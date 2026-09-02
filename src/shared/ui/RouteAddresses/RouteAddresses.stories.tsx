// The From/To address pair — one controllable story + a gallery showing it
// at a short and a long-wrapping address, since that's the one thing that
// visibly changes its layout.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@mantine/core";
import { RouteAddresses } from "./RouteAddresses";

const meta: Meta<typeof RouteAddresses> = {
  title: "Components/RouteAddresses",
  component: RouteAddresses,
  args: {
    from: "Av. Paseo de la Reforma 222, Ciudad de México, CDMX",
    to: "Av. Universidad 1858, Ciudad de México, CDMX",
  },
};
export default meta;

type Story = StoryObj<typeof RouteAddresses>;

export const Playground: Story = {};

export const Gallery: Story = {
  name: "Short & long addresses (gallery)",
  render: () => (
    <Stack gap="xl" w={360}>
      <RouteAddresses from="Reforma 222, CDMX" to="Universidad 1858, CDMX" />
      <RouteAddresses
        from="Blvd. M. Ávila Camacho 40, Toluca, Estado de México"
        to="Calle F. I. Madero 12, Toluca, Estado de México"
      />
    </Stack>
  ),
};
