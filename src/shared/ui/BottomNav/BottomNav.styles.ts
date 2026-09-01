import type { CSSProperties } from "react";
import type { MantineTheme } from "@mantine/core";

export function getStyles(theme: MantineTheme) {
  return {
    bar: {
      borderTop: `1px solid ${theme.colors.dark[4]}`,
      position: "sticky",
      bottom: 0,
      backgroundColor: theme.colors.dark[7],
    },
  } satisfies Record<string, CSSProperties>;
}
