import type { CSSProperties } from "react";
import type { MantineTheme } from "@mantine/core";

export function getStyles(theme: MantineTheme) {
  return {
    // The whole pinned-to-bottom stack: CTA bar on top of BottomNav (which
    // is cross-cutting now, present on every screen — see AGENTS.md's
    // "сквозной" nav requirement). BottomNav supplies its own border/bg;
    // this wrapper only needs the sticky positioning that holds both in
    // place together.
    // zIndex 10 (not just "sticky, no z-index") — without an explicit value
    // here, this sits at the stacking-order default and the sticky tabs
    // list (zIndex 5, its own stacking context) painted OVER it once
    // scrolled to the bottom of the content. 10 matches AppScreen's own
    // header, since the two never overlap on screen.
    footer: {
      position: "sticky",
      bottom: 0,
      zIndex: 10,
    },
    // The CTA bar reads as a card-toned panel sitting on top of BottomNav —
    // same dark.6 surface as Card, rounded only on its top corners (bottom
    // corners are flush against BottomNav below it), no border. Height is
    // whatever its own padding + button need, not pinned to match anything.
    footerCta: {
      backgroundColor: theme.colors.dark[6],
      borderRadius: "32px 32px 0 0",
      padding: 8,
    },
    // Sticks right under the header (--shipment-header-height, measured live
    // — see the ResizeObserver in ShipmentDetailsScreen.tsx) once scrolled
    // that far, same "docks below the header" pattern as Home's
    // stickyShipmentsHeader. Needs its own opaque background so scrolled
    // Timeline/Documents content doesn't show through underneath it.
    // zIndex 5, not 10 — matches Home's stickyShipmentsHeader. AppScreen's
    // own header (SyncStatusBar + id/badge row) is a sticky element with
    // zIndex 10 too; tying that value here made this tab bar win the
    // stacking-order tiebreak (later in the DOM) and paint over the
    // expanded SyncStatusBar panel instead of staying under it.
    stickyTabsList: {
      position: "sticky",
      top: "calc(var(--devbar-height, 0px) + var(--shipment-header-height, 0px))",
      zIndex: 5,
      backgroundColor: "var(--mantine-color-body)",
    },
    // Docks right below the sticky tabs and stays there — NOT just a
    // fixed-height box left in normal flow. A plain (non-sticky) box below
    // a sticky sibling only lines up with it at the *exact* scroll offset
    // where the tabs first lock in place; scroll even one pixel further and
    // the box (which keeps obeying normal scroll math) drifts up out from
    // under the fixed tabs while they stay put — reopening the exact
    // "content behind the tabs" gap this is meant to fix. Making this box
    // sticky too, pinned right under the tabs' own height, keeps the two
    // locked together at any scroll position once both are reached.
    panelScrollArea: {
      position: "sticky",
      top:
        "calc(var(--devbar-height, 0px) + var(--shipment-header-height, 0px)"
        + " + var(--shipment-tabslist-height, 0px) + 8px)",
      height:
        "calc(100vh - var(--devbar-height, 0px) - var(--shipment-header-height, 0px)"
        + " - var(--shipment-tabslist-height, 0px) - var(--shipment-footer-height, 0px))",
      overflowY: "auto",
    },
  } satisfies Record<string, CSSProperties>;
}
