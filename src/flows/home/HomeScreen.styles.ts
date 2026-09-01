import type { CSSProperties } from "react";

export const styles = {
  // Bento hero number — sized so its single line matches the combined height
  // of the two lines to its left ("Today" + the weekday date), so both sides
  // of the header row read as the same visual weight.
  heroTime: {
    fontSize: 52,
    lineHeight: 1.1,
  },
  // Docks under AppScreen's own sticky header (SyncStatusBar). Same
  // --devbar-height var that header uses, plus --syncbar-height (set by
  // SyncStatusBar itself via ResizeObserver — its real rendered height, not
  // a guessed pixel value) so it lands flush under it, no gap.
  stickyShipmentsHeader: {
    position: "sticky",
    top: "calc(var(--devbar-height, 0px) + var(--syncbar-height, 0px))",
    zIndex: 5,
    backgroundColor: "var(--mantine-color-body)",
    paddingTop: 8,
    paddingBottom: 8,
  },
} satisfies Record<string, CSSProperties>;
