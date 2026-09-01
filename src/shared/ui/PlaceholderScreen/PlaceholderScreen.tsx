import { Center, Stack, Text } from "@mantine/core";

export interface PlaceholderScreenProps {
  /** Shown small, above "TBD" — the section name (e.g. "Shipments"). */
  label?: string;
}

/** Not-built-yet section content. Header/footer/AppScreen stay the caller's job. */
export function PlaceholderScreen({ label }: PlaceholderScreenProps) {
  return (
    <Center style={{ minHeight: "60vh" }}>
      <Stack align="center" gap={4}>
        {label && <Text c="dimmed">{label}</Text>}
        <Text fw={800} size="xl" c="dimmed">TBD</Text>
      </Stack>
    </Center>
  );
}

export default PlaceholderScreen;
