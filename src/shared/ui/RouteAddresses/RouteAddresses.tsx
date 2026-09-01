import { Group, Stack, Text } from "@mantine/core";

export interface RouteAddressesProps {
  from: string;
  to: string;
}

/** The From/To pair shared by ShipmentCard (Home) and ShipmentDetailsScreen —
 * one place so both stay visually identical. */
export function RouteAddresses({ from, to }: RouteAddressesProps) {
  return (
    <Group grow align="flex-start" gap={32}>
      <Stack gap={2}>
        <Text size="xs" c="dimmed" fw={600}>From</Text>
        <Text size="sm" fw={600}>{from}</Text>
      </Stack>
      <Stack gap={2}>
        <Text size="xs" c="dimmed" fw={600}>To</Text>
        <Text size="sm" fw={600}>{to}</Text>
      </Stack>
    </Group>
  );
}

export default RouteAddresses;
