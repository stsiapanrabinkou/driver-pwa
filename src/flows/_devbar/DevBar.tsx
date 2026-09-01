// src/flows/_devbar/DevBar.tsx
//
// Designer's dev-only nav bar (think: WordPress admin bar).
//
// Renders ONLY in development. `import.meta.env.DEV` is statically replaced at
// build time, so the prod branch collapses to `return null` and DevBarPanel —
// along with everything it imports — is tree-shaken out of production bundles.
//
// Note the two-component split: the DEV check has to sit in a component with NO
// hooks, otherwise it's a conditional early-return above useState/useMantineTheme
// and react-hooks flags it (correctly).
//
// It reads src/flows/routes.tsx (plain data — no loaders/guards) and builds a
// jump-to-any-screen switcher. Nothing here fetches, stores, or guards.
//
// This app ships a single (graphite) theme — see src/theme/tokens.ts — so
// there's no light/dark toggle here.

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ActionIcon, Badge, Button, Code, Group, SegmentedControl, Select, Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconApps, IconBook, IconBolt, IconEyeOff, IconSitemap,
} from "@tabler/icons-react";
import { flattenRoutes, groupByFlow, resolvePath } from "./flatten";
import { getStyles, hiddenToggle, barInner, selectStyle, spacer } from "./DevBar.styles";

// Where Storybook runs locally (see the `dev` script in package.json).
const STORYBOOK_URL = "http://localhost:6006";
const FLOWMAP_URL = `${STORYBOOK_URL}/?path=/story/system-flow-map--all-flows`;

/** Dev gate only. No hooks in here — that's the whole point of the split. */
export function DevBar() {
  if (!import.meta.env.DEV) return null;
  return <DevBarPanel />;
}

function DevBarPanel() {
  const theme = useMantineTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [role, setRole] = useState<string>("all");
  const [hidden, setHidden] = useState(false);

  // Sticky in-page headers (AppScreen) need to stick BELOW this fixed bar,
  // not under it — otherwise they scroll up and hide behind it. Exposed as a
  // CSS var (default 0px, see AppScreen.styles.ts) so /app stays unaware of
  // the DevBar entirely, and production (where this never mounts) is correct
  // by default.
  useEffect(() => {
    document.documentElement.style.setProperty("--devbar-height", hidden ? "0px" : "44px");
    // removeProperty returns the removed value (a string) — wrapped in
    // braces so the cleanup function returns void, not that string, which
    // useEffect's cleanup type disallows.
    return () => {
      document.documentElement.style.removeProperty("--devbar-height");
    };
  }, [hidden]);

  const all = useMemo(() => flattenRoutes(), []);
  const roles = useMemo(
    () => ["all", ...Array.from(new Set(all.map((r) => r.role)))],
    [all]
  );

  // Mantine Select grouped data: { group, items: { value, label }[] }[]
  const groups = useMemo(() => {
    const visible = role === "all" ? all : all.filter((r) => r.role === role);
    return groupByFlow(visible).map(([flow, items]) => ({
      group: flow,
      items: items.map((r) => ({ label: `${r.label}  ·  ${r.path}`, value: r.path })),
    }));
  }, [all, role]);

  if (hidden) {
    return (
      <Button
        size="xs"
        variant="default"
        leftSection={<IconBolt size={14} />}
        onClick={() => setHidden(false)}
        style={hiddenToggle}
      >
        Dev
      </Button>
    );
  }

  return (
    <>
      <div style={styles.bar}>
        <Group wrap="nowrap" gap="xl" style={barInner}>
          <Group gap="xs" wrap="nowrap">
            <Badge color="blue" variant="light" radius="sm">DEV</Badge>
            <SegmentedControl
              size="xs"
              value={role}
              onChange={setRole}
              data={roles.map((r) => ({ label: r, value: r }))}
            />
            <Select
              size="xs"
              searchable
              clearable
              style={selectStyle}
              placeholder="Jump to screen…"
              value={null}
              data={groups}
              nothingFoundMessage="No screens yet — add one to src/flows/routes.tsx"
              leftSection={<IconApps size={14} />}
              onChange={(path) => {
                if (!path) return;
                const match = all.find((r) => r.path === path);
                // Dynamic route tree => `to` is not literal-typed. Intentional.
                navigate({ to: resolvePath(path, match?.samples) });
              }}
            />
            <Code>{pathname}</Code>
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Tooltip label="Flow map — how all screens connect">
              <Button
                size="xs"
                variant="default"
                leftSection={<IconSitemap size={14} />}
                component="a"
                href={FLOWMAP_URL}
                target="_blank"
              >
                Flow map
              </Button>
            </Tooltip>
            <Tooltip label="Storybook — components & every screen state">
              <Button
                size="xs"
                variant="default"
                leftSection={<IconBook size={14} />}
                component="a"
                href={STORYBOOK_URL}
                target="_blank"
              >
                Storybook
              </Button>
            </Tooltip>
            <Tooltip label="Hide bar">
              <ActionIcon variant="default" size="lg" onClick={() => setHidden(true)}>
                <IconEyeOff size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </div>
      {/* Spacer so the bar never covers the app's own header. */}
      <div style={spacer} />
    </>
  );
}

export default DevBar;
