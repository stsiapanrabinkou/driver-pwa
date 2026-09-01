import { Button, Drawer, Group, Text } from "@mantine/core";

export interface ConfirmSheetProps {
  opened: boolean;
  onClose: () => void;
  question: string;
  confirmLabel: string;
  onConfirm: () => void;
}

/** Bottom sheet used for the two lightweight "are you sure" moments in the flow. */
export function ConfirmSheet({ opened, onClose, question, confirmLabel, onConfirm }: ConfirmSheetProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      radius="md"
      // Mantine's bottom Drawer sizes its content from `size` (there's no
      // built-in "shrink to fit" value — `size="auto"` isn't one of the
      // presets, so it silently resolved to an undefined CSS var and the
      // content fell back to 100% of the viewport). Overriding height
      // directly makes it hug its own content instead.
      styles={{ content: { height: "auto", maxHeight: "85vh" } }}
    >
      <Text fw={700} size="lg" mb="md">{question}</Text>
      <Group grow>
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </Group>
    </Drawer>
  );
}

export default ConfirmSheet;
