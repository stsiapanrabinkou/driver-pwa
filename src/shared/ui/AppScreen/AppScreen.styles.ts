import type { CSSProperties } from "react";

export const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
  },
  frame: {
    width: "100%",
    maxWidth: 768,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  // Fixed in place — the header never scrolls with the content beneath it.
  // `top` sits below the dev-only DevBar when it's mounted (see its own
  // --devbar-height var); defaults to 0px, i.e. the true top, in production.
  header: {
    position: "sticky",
    top: "var(--devbar-height, 0px)",
    zIndex: 10,
    backgroundColor: "var(--mantine-color-body)",
  },
  scrollArea: {
    flex: 1,
  },
} satisfies Record<string, CSSProperties>;
