import { Card, Group, Stack, Text } from "@mantine/core";
import { RouteAddresses } from "../RouteAddresses/RouteAddresses";
import { ShipmentProgressBar } from "../ShipmentProgressBar/ShipmentProgressBar";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { STAGE_PROGRESS, type ShipmentStage } from "../StatusBadge/shipmentStage";

export interface ShipmentCardProps {
  id: string;
  from: string;
  to: string;
  placedLabel: string;
  dueLabel: string;
  dueColor?: string;
  stage: ShipmentStage;
  isDelayed?: boolean;
  onClick?: () => void;
}

export function ShipmentCard({
  id, from, to, placedLabel, dueLabel, dueColor, stage, isDelayed, onClick,
}: ShipmentCardProps) {
  return (
    <Card padding="lg" onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined }}>
      <Stack gap={16}>
        <Group justify="space-between" mb={8}>
          <Text fw={800} size="xl">{id}</Text>
          <StatusBadge stage={stage} isDelayed={isDelayed} />
        </Group>

        <RouteAddresses from={from} to={to} />

        <Group grow align="flex-start" gap={32}>
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={600}>Placed</Text>
            <Text size="sm" fw={600}>{placedLabel}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={600}>Due by</Text>
            <Text size="sm" fw={600} c={dueColor}>{dueLabel}</Text>
          </Stack>
        </Group>

        <ShipmentProgressBar
          value={STAGE_PROGRESS[stage]}
          color={isDelayed ? "orange" : "signal"}
        />
      </Stack>
    </Card>
  );
}

export default ShipmentCard;
