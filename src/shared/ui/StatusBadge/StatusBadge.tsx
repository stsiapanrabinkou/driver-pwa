import { Group, Badge } from "@mantine/core";
import { STAGE_META, type ShipmentStage } from "./shipmentStage";

export type { ShipmentStage };

export interface StatusBadgeProps {
  stage: ShipmentStage;
  /** Delay is a flag on top of the stage, not a stage of its own — shown as
   * a second badge alongside the stage, not a replacement for it. */
  isDelayed?: boolean;
}

export function StatusBadge({ stage, isDelayed }: StatusBadgeProps) {
  const meta = STAGE_META[stage];
  const showDelayed = isDelayed && stage !== "delivered" && stage !== "returned";

  return (
    <Group gap={6} wrap="nowrap">
      <Badge color={meta.color} variant="filled" radius="xl">
        {meta.label}
      </Badge>
      {showDelayed && (
        <Badge color="yellow" variant="filled" radius="xl">
          Delayed
        </Badge>
      )}
    </Group>
  );
}

export default StatusBadge;
