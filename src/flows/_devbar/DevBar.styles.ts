// src/flows/_devbar/DevBar.styles.ts
//
// Style objects for the DevBar, kept out of the JSX (the kit convention:
// co-located *.styles.ts, never scattered inline). Static objects are exported
// directly; the token-dependent one comes from getStyles(theme) so it still
// reads from the theme instead of hardcoding anything — no CSS-in-JS, no hex.
//
// Note the Mantine twist: the fixed bar's colour-scheme-aware chrome uses
// Mantine CSS variables (var(--mantine-color-body) / -default-border), which
// resolve per light/dark automatically. That's why there's no isDark branching
// anywhere — the variables ARE the tokens, and they follow the color scheme.

import type { CSSProperties } from "react";
import type { MantineTheme } from "@mantine/core";

export const hiddenToggle: CSSProperties = {
  position: "fixed", top: 8, left: 8, zIndex: 9999,
};
// On narrow (mobile) viewports the bar's contents don't fit in one row. Rather
// than wrap (which would need a dynamic-height spacer) or shrink individual
// controls, the bar scrolls horizontally WITHIN itself — the page/app frame
// never does. `barInner` needs a width wider than 100% is fine here since its
// parent (`bar`) is the thing clipping/scrolling it.
export const barInner: CSSProperties = { height: "100%", minWidth: "max-content" };
export const selectStyle: CSSProperties = { width: 260, flexShrink: 0 };
export const spacer: CSSProperties = { height: 44 };

export const getStyles = (theme: MantineTheme) =>
  ({
    bar: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      height: 44, padding: "0 12px",
      background: "var(--mantine-color-body)",
      borderBottom: "1px solid var(--mantine-color-default-border)",
      boxShadow: theme.shadows.sm,
      overflowX: "auto",
      overflowY: "hidden",
    },
  }) satisfies Record<string, CSSProperties>;
