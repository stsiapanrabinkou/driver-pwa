import type { CSSProperties } from "react";
import type { MantineTheme } from "@mantine/core";

export function getStyles(theme: MantineTheme) {
  return {
    root: {
      position: "relative",
    },
    bar: {
      cursor: "pointer",
    },
    // Invisible full-viewport catcher, mounted only while the panel is open.
    // Sits above the page content but below the panel itself, so a tap
    // anywhere outside the panel hits this (closing it) instead of reaching
    // — and also triggering — whatever control is underneath.
    backdrop: {
      position: "fixed",
      inset: 0,
      zIndex: 15,
    },
    // Overlays the scrollable content below instead of pushing it down —
    // absolutely positioned against `root`, right under the bar.
    panel: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      zIndex: 20,
      borderTop: `1px solid ${theme.colors.dark[4]}`,
      borderBottom: `1px solid ${theme.colors.dark[4]}`,
      backgroundColor: "var(--mantine-color-body)",
      boxShadow: theme.shadows.md,
    },
    // ThemeIcon's "default" variant ships a border by default — the pending
    // items just want the filled swatch behind the icon, no outline.
    itemIcon: {
      border: "none",
    },
    // The title (md, fw 600) and the timestamp (sm) have different
    // line-heights, so aligning both boxes to the row's top still leaves the
    // shorter timestamp text sitting visually higher than the title text —
    // nudge it down by half that line-height delta to land on the same line.
    itemTimestamp: {
      marginTop: 2,
    },
  } satisfies Record<string, CSSProperties>;
}
