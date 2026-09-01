// src/stories/FlowMap.stories.tsx
//
// The Flow Map the DevBar links to. The story ID is load-bearing:
//   title "System/Flow Map" + export `AllFlows` -> system-flow-map--all-flows
// which is exactly the URL in src/flows/_devbar/DevBar.tsx. Rename either side
// and the DevBar's "Flow map" button 404s.
//
// Reads the designer's route tree and renders every screen, grouped by flow,
// filterable by role, with a click-through into the running app. Pure data —
// no fetching, no state, no guards.

import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion, Alert, Badge, Button, Card, Code, Group, SegmentedControl, Stack,
  Table, Text, Title,
} from "@mantine/core";
import { IconExternalLink, IconSitemap } from "@tabler/icons-react";
import { flattenRoutes, groupByFlow, resolvePath } from "../flows/_devbar/flatten";

// Where `npm run dev` serves the app. Matches vite's default.
const APP_URL = "http://localhost:5173";

function FlowMap() {
  const [role, setRole] = useState<string>("all");

  const all = useMemo(() => flattenRoutes(), []);
  const roles = useMemo(
    () => ["all", ...Array.from(new Set(all.map((r) => r.role)))],
    [all]
  );

  const visible = role === "all" ? all : all.filter((r) => r.role === role);
  const groups = groupByFlow(visible);

  return (
    <Stack gap="md" p="lg">
      <Group gap="xs">
        <IconSitemap size={22} />
        <Title order={3}>Flow map</Title>
        <Badge variant="light">{all.length} screens</Badge>
      </Group>

      <Text c="dimmed">
        Every screen declared in <Code>src/flows/routes.tsx</Code>, grouped by
        flow. Roles here are design annotation — labels for navigating the
        prototype, not access control.
      </Text>

      {all.length === 0 ? (
        <Card withBorder padding="lg">
          <Text c="dimmed" ta="center">
            No flows yet. Add an entry to src/flows/routes.tsx and this fills in
            automatically.
          </Text>
        </Card>
      ) : (
        <>
          <Group gap="xs">
            <Text c="dimmed">Role:</Text>
            <SegmentedControl
              value={role}
              onChange={setRole}
              data={roles.map((r) => ({ label: r, value: r }))}
            />
          </Group>

          <Alert variant="light" icon={<IconExternalLink size={16} />}>
            &quot;Open&quot; links assume the app is running at {APP_URL}.
          </Alert>

          <Accordion multiple defaultValue={groups.map(([flow]) => flow)}>
            {groups.map(([flow, items]) => (
              <Accordion.Item key={flow} value={flow}>
                <Accordion.Control>
                  <Group gap="xs">
                    <Text fw={600}>{flow}</Text>
                    <Badge variant="light">{items.length}</Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Table striped highlightOnHover withRowBorders={false}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Screen</Table.Th>
                        <Table.Th>Path</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th w={120} />
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {items.map((row) => (
                        <Table.Tr key={row.path}>
                          <Table.Td><Text fw={600}>{row.label}</Text></Table.Td>
                          <Table.Td><Code>{row.path}</Code></Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={row.role === "unassigned" ? "gray" : "blue"}
                            >
                              {row.role}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Button
                              size="xs"
                              variant="default"
                              leftSection={<IconExternalLink size={14} />}
                              component="a"
                              href={`${APP_URL}${resolvePath(row.path, row.samples)}`}
                              target="_blank"
                            >
                              Open
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
    </Stack>
  );
}

const meta: Meta<typeof FlowMap> = {
  title: "System/Flow Map",
  component: FlowMap,
  parameters: { layout: "fullscreen" },
};

export default meta;

// Export name is load-bearing — see the header comment.
export const AllFlows: StoryObj<typeof FlowMap> = {};
