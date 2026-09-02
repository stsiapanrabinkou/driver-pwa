// Theme default: size="lg" (bigControlSizes, added specifically so this
// matches every other input's 48px height — it wasn't in that list
// originally and shipped a size smaller than its neighbors). Used as the
// Shipments tab's due-date range filter.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@mantine/core";
import { DatePickerInput, type DatesRangeValue } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const meta: Meta<typeof DatePickerInput> = {
  title: "Components/DatePickerInput",
  component: DatePickerInput,
  argTypes: {
    type: { control: "select", options: ["default", "range", "multiple"] },
    clearable: { control: "boolean" },
  },
  args: {
    placeholder: "Due date range",
    leftSection: <IconCalendar size={18} />,
    clearable: true,
  },
};
export default meta;

type Story = StoryObj<typeof DatePickerInput>;

function RangeRender() {
  const [range, setRange] = useState<DatesRangeValue>([null, null]);
  return (
    <Stack w={320}>
      <DatePickerInput
        type="range"
        placeholder="Due date range"
        leftSection={<IconCalendar size={18} />}
        value={range}
        onChange={setRange}
        clearable
      />
    </Stack>
  );
}

export const Playground: Story = {
  render: () => <RangeRender />,
};

export const AllVariants: Story = {
  name: "Empty vs picked (gallery)",
  render: () => (
    <Stack gap="md" w={320}>
      <DatePickerInput type="range" placeholder="Due date range" leftSection={<IconCalendar size={18} />} clearable />
      <DatePickerInput
        type="range"
        leftSection={<IconCalendar size={18} />}
        value={["2026-08-13", "2026-08-14"]}
        clearable
        readOnly
      />
    </Stack>
  ),
};
