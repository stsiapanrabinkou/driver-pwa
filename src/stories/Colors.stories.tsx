// src/stories/Colors.stories.tsx
//
// Every color token declared in src/theme/tokens.ts, plus the semantic
// (stage) colors the app draws from Mantine's own default palette. Read
// this before reaching for a hex literal anywhere in /flows — everything
// here is what `tokens-not-hardcoded-colors` (eslint.presentation.js) is
// checking for.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { STAGE_META } from "../shared/ui/StatusBadge/shipmentStage";

const SHADE_NOTE: Record<number, string> = {
  0: "lightest",
  6: "primary shade (light & dark)",
  9: "darkest",
};

function Swatch({ hex, index, note }: { hex: string; index: number; note?: string }) {
  return (
    <Stack gap={4} w={104}>
      <Box
        style={{
          height: 64,
          borderRadius: "var(--mantine-radius-md)",
          backgroundColor: hex,
          border: "1px solid var(--mantine-color-dark-4)",
        }}
      />
      <Text size="sm" fw={600}>{index}</Text>
      <Text size="xs" c="dimmed" ff="monospace">{hex}</Text>
      {note && <Text size="xs" c="dimmed">{note}</Text>}
    </Stack>
  );
}

function ColorScale({ name, colors, description }: { name: string; colors: readonly string[]; description: string }) {
  return (
    <Stack gap="xs">
      <Stack gap={2}>
        <Title order={4}>{name}</Title>
        <Text size="sm" c="dimmed">{description}</Text>
      </Stack>
      <Group gap="sm" wrap="wrap" align="flex-start">
        {colors.map((hex, index) => (
          <Swatch key={index} hex={hex} index={index} note={SHADE_NOTE[index]} />
        ))}
      </Group>
    </Stack>
  );
}

function ColorsPage() {
  const theme = useMantineTheme();

  const stageColors = Array.from(new Set(Object.values(STAGE_META).map((m) => m.color)));

  return (
    <Stack gap={40} maw={900} mx="auto" p="lg">
      <Stack gap={4}>
        <Title order={3}>Colors</Title>
        <Text c="dimmed">
          Three custom color scales live in <Text span ff="monospace" c="dimmed">src/theme/tokens.ts</Text> —
          everything else in the app reads from these, or from Mantine&apos;s
          own default palette for status semantics. This file is the one
          exemption from the hex-literal ban (see AGENTS.md §6).
        </Text>
      </Stack>

      <ColorScale
        name="dark (graphite)"
        description="The app's one neutral scale — background, tile surfaces, chrome, text. Index 6 (#1F1F1F) is the shared card/tile surface; index 7 (pure black) is the page background beneath it."
        colors={theme.colors.dark}
      />

      <ColorScale
        name="signal"
        description="Safety-orange accent — primaryColor, every primary action, active/selected states, focus rings. Index 6 is the primary shade in both light and dark mode."
        colors={theme.colors.signal}
      />

      <ColorScale
        name="alert"
        description="A second accent explored for the Home screen's alert tile. Only index 5 was hand-picked to spec; the rest of the ramp exists so it's a valid, usable Mantine color."
        colors={theme.colors.alert}
      />

      <Stack gap="xs">
        <Stack gap={2}>
          <Title order={4}>Semantic status colors</Title>
          <Text size="sm" c="dimmed">
            Shipment stage colors (StatusBadge, ShipmentCard, ShipmentProgressBar) — Mantine&apos;s
            own default palette, not a custom scale, so a stage's meaning
            (in-progress = blue, resolved-good = green, resolved-bad = red)
            stays instantly recognizable rather than blending into the
            app's own orange identity.
          </Text>
        </Stack>
        <Group gap="sm">
          {stageColors.map((color) => (
            <Stack key={color} gap={4} w={104}>
              <Box
                style={{
                  height: 64,
                  borderRadius: "var(--mantine-radius-md)",
                  backgroundColor: `var(--mantine-color-${color}-6)`,
                  border: "1px solid var(--mantine-color-dark-4)",
                }}
              />
              <Text size="sm" fw={600}>{color}</Text>
            </Stack>
          ))}
        </Group>
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof ColorsPage> = {
  title: "System/Colors",
  component: ColorsPage,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const AllColors: StoryObj<typeof ColorsPage> = {};
