import { Box, Group, Text, useMantineTheme } from "@mantine/core";
import { IconTruckFilled } from "@tabler/icons-react";
import { getStyles } from "./ShipmentProgressBar.styles";

export interface ShipmentProgressBarProps {
  /** 0–100 */
  value: number;
  /** Theme color name (no shade) for the fill gradient and thumb. */
  color?: string;
}

export function ShipmentProgressBar({ value, color = "signal" }: ShipmentProgressBarProps) {
  const theme = useMantineTheme();
  const styles = getStyles(theme);
  const clamped = Math.max(0, Math.min(100, value));
  // Keep the thumb from clipping past either rounded end of the track.
  const thumbPosition = Math.max(6, Math.min(94, clamped));

  return (
    <Group gap={12} align="center" wrap="nowrap">
      <Box style={styles.wrapper}>
        <Box style={styles.track}>
          <Box
            style={{
              ...styles.fill,
              width: `${clamped}%`,
              background: `linear-gradient(135deg, var(--mantine-color-${color}-5), var(--mantine-color-${color}-7))`,
            }}
          />
        </Box>
        <Box
          style={{
            ...styles.thumb,
            left: `${thumbPosition}%`,
            backgroundColor: `var(--mantine-color-${color}-6)`,
          }}
        >
          <IconTruckFilled size={20} color="white" />
        </Box>
      </Box>
      <Text fw={800} size="lg" style={{ minWidth: 48, textAlign: "right" }}>
        {Math.round(clamped)}%
      </Text>
    </Group>
  );
}

export default ShipmentProgressBar;
