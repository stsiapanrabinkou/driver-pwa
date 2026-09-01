// src/stories/ThemeShowcase.stories.tsx
//
// The COMPLETE kitchen sink: one instance of (nearly) every Mantine component,
// grouped by category. Because Mantine is themed from the MantineProvider theme
// (createTheme) + CSS variables, this page is where a designer verifies that a
// token change (primaryColor, defaultRadius, fontFamily, a custom color tuple)
// landed EVERYWHERE. Change /src/theme/tokens.ts, reload this story, scan top to
// bottom.
//
// Targets Mantine v9 (current line). It also renders on recent v8 — the few
// pieces that are strictly v9.4+ (DataList, EmptyState, Menubar) are called out
// in comments and NOT used here, so the sink stays green on any recent major.
// If you're on a newer major and something here was removed, that's this page
// doing its job: surfacing the break immediately.
//
// Requires the ThemeProvider decorator in .storybook/preview (see SETUP.md) so
// this reflects the real theme AND so the overlay components below have their
// providers: ModalsProvider (modals.*) and <Notifications /> (notifications.*).
// The dates row needs @mantine/dates/styles.css (imported in ThemeProvider).
//
// Overlay components (Modal, Drawer, Notification, confirm modal) are shown via
// trigger buttons — click to theme-check them.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion, ActionIcon, Alert, Anchor, Autocomplete, Avatar, Badge, Box,
  Breadcrumbs, Burger, Button, Card, Checkbox, Chip, Code, ColorInput,
  CopyButton, Divider, Drawer, Fieldset, FileInput, Group, HoverCard, Image,
  Indicator, Kbd, List, Loader, Mark, Menu, Modal, MultiSelect, NavLink,
  Notification, NumberInput, Pagination, PasswordInput, PinInput, Popover,
  Progress, Radio, Rating, RangeSlider, RingProgress, ScrollArea, SegmentedControl,
  Select, SimpleGrid, Skeleton, Slider, Spoiler, Stack, Stepper, Switch, Table,
  Tabs, TagsInput, Text, Textarea, TextInput, ThemeIcon, Timeline, Title,
  Tooltip, Tree, useMantineTheme,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import {
  IconAlertTriangle, IconBell, IconCircleCheck, IconHome, IconInfoCircle,
  IconSettings, IconStar, IconUpload, IconUser,
} from "@tabler/icons-react";

// ---- shared demo data (mock only; nothing here calls a network) ----
const selectData = [
  { value: "1", label: "Option one" },
  { value: "2", label: "Option two" },
  { value: "3", label: "Option three" },
];
const treeData = [
  { value: "parent", label: "Parent", children: [{ value: "a", label: "Child A" }, { value: "b", label: "Child B" }] },
];
// Solid-fill placeholder — no color literal, so the tokens-not-hex rule is happy.
const tinyImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='gray'/%3E%3C/svg%3E";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="sm">
      <Divider label={title} labelPosition="left" />
      <Group align="flex-start" gap="lg" wrap="wrap">{children}</Group>
    </Stack>
  );
}

function Showcase() {
  const theme = useMantineTheme();
  const primary = theme.colors[theme.primaryColor];
  const [modalOpened, modal] = useDisclosure(false);
  const [drawerOpened, drawer] = useDisclosure(false);
  const [burger, setBurger] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [range, setRange] = useState<[string | null, string | null]>([null, null]);

  return (
    <Stack gap="xl" maw={960} mx="auto" p="lg">
      <Stack gap={4}>
        <Title order={3}>Theme showcase — all components</Title>
        <Text c="dimmed">
          Themed from <Code>src/theme/tokens.ts</Code>. Change a token, reload,
          scan for anything that didn&apos;t update.
        </Text>
      </Stack>

      <Section title="General — Button, ActionIcon, Anchor, CopyButton">
        <Button>Filled</Button>
        <Button variant="light">Light</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="default">Default</Button>
        <Button variant="gradient" gradient={{ from: "grape", to: "indigo" }}>Gradient</Button>
        <Button color="red">Danger</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <ActionIcon variant="filled" aria-label="settings"><IconSettings size={16} /></ActionIcon>
        <Anchor href="#top">Anchor link</Anchor>
        <CopyButton value="hello">
          {({ copied, copy }) => (
            <Button variant="default" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
          )}
        </CopyButton>
      </Section>

      <Section title="Typography — Title, Text, Mark, Code, Kbd">
        <Stack gap={4}>
          <Title order={4}>Title level 4</Title>
          <Text>Body text.</Text>
          <Text size="sm" c="dimmed">Dimmed small text.</Text>
          <Text c="red">Coloured text.</Text>
          <Text fw={700}>Bold text.</Text>
          <Text>Some <Mark>highlighted</Mark> words and <Code>inline code</Code>.</Text>
          <Text>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>.</Text>
        </Stack>
      </Section>

      <Section title="Inputs — Text, Password, Textarea, Number, PIN, File">
        <TextInput label="Text input" placeholder="Type here" w={200} />
        <PasswordInput label="Password" placeholder="Secret" w={200} />
        <Textarea label="Textarea" placeholder="Multiple lines" w={220} autosize minRows={2} />
        <NumberInput label="Number" defaultValue={10} w={160} />
        <Box>
          <Text size="sm" mb={4}>PIN</Text>
          <PinInput />
        </Box>
        <FileInput label="Upload" placeholder="Pick a file" leftSection={<IconUpload size={16} />} w={200} />
      </Section>

      <Section title="Combobox — Select, MultiSelect, Autocomplete, TagsInput">
        <Select label="Select" placeholder="Pick one" data={selectData} w={200} />
        <MultiSelect label="MultiSelect" placeholder="Pick many" data={selectData} w={220} />
        <Autocomplete label="Autocomplete" placeholder="Start typing" data={["React", "Vue", "Svelte"]} w={200} />
        <TagsInput label="TagsInput" placeholder="Add tags" defaultValue={["design", "code"]} w={220} />
      </Section>

      <Section title="Selection — Checkbox, Radio, Switch, Chip, Segmented, Slider, Rating, Color">
        <Checkbox defaultChecked label="Checkbox" />
        <Radio.Group defaultValue="a" label="Radio group">
          <Group mt="xs">
            <Radio value="a" label="Left" />
            <Radio value="b" label="Right" />
          </Group>
        </Radio.Group>
        <Switch defaultChecked label="Switch" />
        <Chip defaultChecked>Chip</Chip>
        <SegmentedControl data={["Daily", "Weekly", "Monthly"]} />
        <Box w={200}>
          <Text size="sm" mb={4}>Slider</Text>
          <Slider defaultValue={40} />
        </Box>
        <Box w={200}>
          <Text size="sm" mb={4}>Range slider</Text>
          <RangeSlider defaultValue={[20, 60]} />
        </Box>
        <Rating defaultValue={3} />
        <ColorInput label="Color" defaultValue={primary[6]} w={200} />
      </Section>

      <Section title="Dates — DatePickerInput, range, TimeInput">
        <DatePickerInput label="Date" placeholder="Pick a date" value={date} onChange={setDate} w={200} />
        <DatePickerInput type="range" label="Range" placeholder="Pick dates" value={range} onChange={setRange} w={220} />
        <TimeInput label="Time" w={140} />
      </Section>

      <Section title="Data display — Avatar, Indicator, Badge, ThemeIcon, Progress, Ring">
        <Indicator label={5} size={16}><Avatar radius="sm"><IconUser size={18} /></Avatar></Indicator>
        <Avatar.Group>
          <Avatar>AB</Avatar>
          <Avatar color={theme.primaryColor}>CD</Avatar>
          <Avatar>+2</Avatar>
        </Avatar.Group>
        <Badge>Badge</Badge>
        <Badge variant="light" color="green">success</Badge>
        <Badge variant="outline" color="red">error</Badge>
        <ThemeIcon variant="light" size="lg"><IconStar size={18} /></ThemeIcon>
        <Box w={200}>
          <Text size="sm" mb={4}>Progress</Text>
          <Progress value={60} />
        </Box>
        <RingProgress
          size={80}
          sections={[{ value: 72, color: theme.primaryColor }]}
          label={<Text ta="center" size="xs">72%</Text>}
        />
      </Section>

      <Section title="Data display — Card, Table, List, Spoiler">
        <Card withBorder shadow="sm" radius="md" padding="md" w={260}>
          <Group justify="space-between" mb="xs">
            <Text fw={600}>Card</Text>
            <Anchor href="#top" size="sm">More</Anchor>
          </Group>
          <Text size="sm" c="dimmed">Card body content.</Text>
        </Card>
        <Table w={340} striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th ta="right">Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Row one</Table.Td>
              <Table.Td><Badge variant="light">active</Badge></Table.Td>
              <Table.Td ta="right">1,200</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Row two</Table.Td>
              <Table.Td><Badge variant="light">active</Badge></Table.Td>
              <Table.Td ta="right">3,400</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <List w={220} spacing="xs" size="sm" withPadding>
          <List.Item>List item one</List.Item>
          <List.Item>List item two</List.Item>
          <List.Item>List item three</List.Item>
        </List>
        <Box w={220}>
          <Spoiler maxHeight={38} showLabel="Show more" hideLabel="Hide">
            <Text size="sm">
              A spoiler hides overflowing content behind a toggle. This paragraph
              is long enough that the rest is collapsed until you expand it.
            </Text>
          </Spoiler>
        </Box>
      </Section>

      <Section title="Data display — Accordion, Timeline, Tree, Image">
        <Box w={260}>
          <Accordion variant="contained">
            <Accordion.Item value="one">
              <Accordion.Control>Panel one</Accordion.Control>
              <Accordion.Panel>Content one</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="two">
              <Accordion.Control>Panel two</Accordion.Control>
              <Accordion.Panel>Content two</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Box>
        <Timeline active={1} bulletSize={18} lineWidth={2} w={200}>
          <Timeline.Item title="Created">Submitted</Timeline.Item>
          <Timeline.Item title="In review">Underwriting</Timeline.Item>
          <Timeline.Item title="Decision">Pending</Timeline.Item>
        </Timeline>
        <Tree data={treeData} w={200} />
        <Image w={120} h={80} radius="md" src={tinyImg} alt="placeholder" />
      </Section>

      <Section title="Navigation — Tabs, Stepper, Breadcrumbs, Pagination, NavLink, Menu, Burger">
        <Box w={280}>
          <Tabs defaultValue="one">
            <Tabs.List>
              <Tabs.Tab value="one">Tab one</Tabs.Tab>
              <Tabs.Tab value="two">Tab two</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="one" pt="xs">Panel one</Tabs.Panel>
            <Tabs.Panel value="two" pt="xs">Panel two</Tabs.Panel>
          </Tabs>
        </Box>
        <Box w={320}>
          <Stepper active={1} size="sm">
            <Stepper.Step label="Start" />
            <Stepper.Step label="Doing" />
            <Stepper.Step label="Done" />
          </Stepper>
        </Box>
        <Breadcrumbs>
          <Anchor href="#top">Home</Anchor>
          <Anchor href="#top">Section</Anchor>
          <Text>Page</Text>
        </Breadcrumbs>
        <Pagination total={5} defaultValue={1} size="sm" />
        <Box w={220}>
          <NavLink label="Nav one" leftSection={<IconHome size={16} />} active />
          <NavLink label="Nav two" leftSection={<IconSettings size={16} />} />
        </Box>
        <Menu shadow="md" width={180}>
          <Menu.Target><Button variant="default">Menu</Button></Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Burger opened={burger} onClick={() => setBurger((o) => !o)} aria-label="menu" />
      </Section>

      <Section title="Feedback — Alert, Loader, Skeleton, Notification">
        <Alert variant="light" color="blue" title="Info" icon={<IconInfoCircle size={16} />}>Informational.</Alert>
        <Alert variant="light" color="green" title="Success" icon={<IconCircleCheck size={16} />}>All good.</Alert>
        <Alert variant="light" color="yellow" title="Warning" icon={<IconAlertTriangle size={16} />}>Careful.</Alert>
        <Alert variant="light" color="red" title="Error" icon={<IconAlertTriangle size={16} />}>Something broke.</Alert>
        <Loader />
        <Loader type="dots" />
        <Loader type="bars" />
        <Stack gap={6} w={220}>
          <Skeleton height={12} radius="sm" />
          <Skeleton height={12} radius="sm" width="70%" />
          <Skeleton height={12} radius="sm" width="50%" />
        </Stack>
        <Box w={320}>
          <Notification title="Notification" icon={<IconBell size={16} />} withCloseButton={false}>
            A themed inline notification.
          </Notification>
        </Box>
      </Section>

      <Section title="Overlays — Tooltip, Popover, HoverCard (hover/click to check)">
        <Tooltip label="Tooltip text"><Button variant="default">Hover: Tooltip</Button></Tooltip>
        <Popover width={200} withArrow>
          <Popover.Target><Button variant="default">Click: Popover</Button></Popover.Target>
          <Popover.Dropdown><Text size="sm">Popover content.</Text></Popover.Dropdown>
        </Popover>
        <HoverCard width={200} withArrow>
          <HoverCard.Target><Button variant="default">Hover: HoverCard</Button></HoverCard.Target>
          <HoverCard.Dropdown><Text size="sm">HoverCard content.</Text></HoverCard.Dropdown>
        </HoverCard>
      </Section>

      <Section title="Overlays — Modal, Drawer, imperative modal & notification (click to check)">
        <Button variant="default" onClick={modal.open}>Modal</Button>
        <Button variant="default" onClick={drawer.open}>Drawer</Button>
        <Button
          variant="default"
          onClick={() =>
            modals.openConfirmModal({
              title: "Confirm?",
              children: <Text size="sm">Themed confirm modal.</Text>,
              labels: { confirm: "Confirm", cancel: "Cancel" },
            })
          }
        >
          Confirm modal
        </Button>
        <Button
          variant="default"
          onClick={() =>
            notifications.show({ title: "Notification", message: "Themed notification", color: "green" })
          }
        >
          Notify
        </Button>
        <Modal opened={modalOpened} onClose={modal.close} title="Modal">
          <Text size="sm">Themed modal content.</Text>
        </Modal>
        <Drawer opened={drawerOpened} onClose={drawer.close} title="Drawer">
          <Text size="sm">Themed drawer content.</Text>
        </Drawer>
      </Section>

      <Section title="Layout — Fieldset (the form pattern), SimpleGrid, ScrollArea">
        <Fieldset legend="Personal information" w={260}>
          <TextInput label="Name" placeholder="Jane Doe" />
          <TextInput label="Email" mt="sm" placeholder="jane@x" error="Looks invalid" />
        </Fieldset>
        <SimpleGrid cols={3} spacing="xs" w={260}>
          {[1, 2, 3].map((n) => (
            <Card key={n} withBorder padding="xs" ta="center">col {n}</Card>
          ))}
        </SimpleGrid>
        <ScrollArea h={80} w={200} type="always">
          <Stack gap="xs" p="xs">
            {Array.from({ length: 8 }, (_, i) => <Text key={i} size="sm">Scrollable row {i + 1}</Text>)}
          </Stack>
        </ScrollArea>
      </Section>
    </Stack>
  );
}

const meta: Meta<typeof Showcase> = {
  title: "System/Theme Showcase",
  component: Showcase,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const AllComponents: StoryObj<typeof Showcase> = {};
