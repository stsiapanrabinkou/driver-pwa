import type { CSSProperties } from "react";
import type { MantineTheme } from "@mantine/core";

const TRACK_HEIGHT = 24;
const THUMB_SIZE = 32;

export function getStyles(theme: MantineTheme) {
  return {
    wrapper: {
      position: "relative",
      height: THUMB_SIZE,
      flex: 1,
    },
    track: {
      position: "absolute",
      left: 0,
      right: 0,
      top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
      height: TRACK_HEIGHT,
      borderRadius: TRACK_HEIGHT / 2,
      overflow: "hidden",
      // Subtle diagonal hatch on the "remaining" portion of the track.
      backgroundColor: theme.colors.dark[5],
      backgroundImage: `repeating-linear-gradient(135deg, ${theme.colors.dark[4]} 0, ${theme.colors.dark[4]} 1px, transparent 1px, transparent 7px)`,
    },
    fill: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      borderRadius: TRACK_HEIGHT / 2,
      transition: "width 200ms ease",
    },
    thumb: {
      position: "absolute",
      top: 0,
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "translateX(-50%)",
      transition: "left 200ms ease",
      boxShadow: theme.shadows.sm,
    },
  } satisfies Record<string, CSSProperties>;
}
