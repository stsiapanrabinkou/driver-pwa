// src/stories/Typography.stories.tsx
//
// The type system from src/theme/tokens.ts: one family (Space Grotesk),
// bold headings by default, and a 5-step font-size scale tuned a notch
// larger than Mantine's own defaults for on-the-move legibility.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Stack, Text, Title } from "@mantine/core";

const FONT_SIZES: { token: string; rem: string; px: number }[] = [
  { token: "xs", rem: "0.8125rem", px: 13 },
  { token: "sm", rem: "0.9375rem", px: 15 },
  { token: "md", rem: "1.0625rem", px: 17 },
  { token: "lg", rem: "1.1875rem", px: 19 },
  { token: "xl", rem: "1.375rem", px: 22 },
];

function TypographyPage() {
  return (
    <Stack gap={40} maw={720} mx="auto" p="lg">
      <Stack gap={4}>
        <Title order={3}>Typography</Title>
        <Text c="dimmed">
          One family everywhere —{" "}
          <Text span ff="monospace" c="dimmed">&apos;Space Grotesk&apos;</Text>, loaded via Google
          Fonts in <Text span ff="monospace" c="dimmed">index.html</Text>. Headings default to
          weight 700 (theme.headings.fontWeight); body text stays at Mantine&apos;s
          own default weight unless a screen calls for more.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Title order={4}>Font family</Title>
        <Text style={{ fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif" }} size="xl">
          Space Grotesk — ABCDEFGHIJKLM abcdefghijklm 0123456789
        </Text>
      </Stack>

      <Stack gap="sm">
        <Title order={4}>Headings (theme.headings.fontWeight: 700)</Title>
        <Stack gap={6}>
          <Title order={1}>Heading 1</Title>
          <Title order={2}>Heading 2</Title>
          <Title order={3}>Heading 3</Title>
          <Title order={4}>Heading 4</Title>
          <Title order={5}>Heading 5</Title>
          <Title order={6}>Heading 6</Title>
        </Stack>
      </Stack>

      <Stack gap="sm">
        <Stack gap={2}>
          <Title order={4}>Font size scale</Title>
          <Text size="sm" c="dimmed">
            Every step here sits a notch above Mantine&apos;s own default for
            that token — the same &quot;bigger, easier to read at a glance&quot;
            reasoning as the big-control sizing below.
          </Text>
        </Stack>
        <Stack gap={10}>
          {FONT_SIZES.map(({ token, rem, px }) => (
            <Group key={token} justify="space-between" wrap="nowrap">
              <Text size={token as "xs" | "sm" | "md" | "lg" | "xl"}>
                The quick brown fox — size=&quot;{token}&quot;
              </Text>
              <Text size="sm" c="dimmed" ff="monospace" style={{ flexShrink: 0 }}>
                {rem} · {px}px
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>

      <Stack gap="sm">
        <Title order={4}>Text weight</Title>
        <Stack gap={4}>
          <Text fw={400}>Regular (400) — default body copy.</Text>
          <Text fw={500}>Medium (500) — inactive tab labels, secondary emphasis.</Text>
          <Text fw={600}>Semibold (600) — card titles, field labels.</Text>
          <Text fw={700}>Bold (700) — headings, active tab labels, section titles.</Text>
          <Text fw={800}>Extrabold (800) — screen titles (e.g. shipment ID in headers).</Text>
        </Stack>
      </Stack>

      <Stack gap="sm">
        <Title order={4}>Dimmed text</Title>
        <Text c="dimmed">
          c=&quot;dimmed&quot; — timestamps, helper copy, secondary labels
          throughout every screen.
        </Text>
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof TypographyPage> = {
  title: "System/Typography",
  component: TypographyPage,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const AllTypography: StoryObj<typeof TypographyPage> = {};
