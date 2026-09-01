import { createTheme, type MantineColorsTuple } from "@mantine/core";

// The one neutral scale for the whole app — page background, card/tile
// surfaces, chrome, and text all come from here. Index 0 is the lightest
// (primary text — pure white), index 9 the darkest. Index 6 is the shared
// "tile" color (cards, mini stat tiles, everything that reads as a surface);
// index 7 is the page background (pure black) beneath those tiles.
const graphite: MantineColorsTuple = [
  "#FFFFFF", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575",
  "#616161", "#1F1F1F", "#000000", "#141414", "#000000",
];

// Safety-orange accent — primary actions, active states, focus rings. Warm
// and saturated enough to stay legible against both black and the #1F1F1F
// tile surfaces.
const signal: MantineColorsTuple = [
  "#FFF4E8", "#FFE3C2", "#FFD09B", "#FFBC73", "#FFA84B",
  "#FF9524", "#FF7A00", "#E86A00", "#C25800", "#9C4600",
];

// Alert accent — a trial color for the Home screen's "Alerts" tile
// (currently being explored against the white variant). Index 5 is the exact
// value asked for; the rest of the ramp exists only so this is a valid,
// usable Mantine color.
const alert: MantineColorsTuple = [
  "#FEF3E7", "#FCE2C9", "#F9D1AB", "#F6C08D", "#F3B36F",
  "#F1A451", "#D98D3E", "#B8752F", "#8F5B24", "#68421A",
];

// Large, glove/road-friendly control sizing: every interactive control below
// defaults to "lg" (~50px) instead of Mantine's default "sm" (~36px), per the
// "big enough to aim easily while driving" requirement.
const bigControlSizes = { size: "lg" };

// Primary actions get a warm gradient instead of a flat fill — depth over
// flatness is the point. Secondary/utility buttons keep their explicit
// variant ("default", "light", "subtle") and are unaffected.
const ctaGradient = { from: "signal.5", to: "signal.7", deg: 135 };

export const theme = createTheme({
  primaryColor: "signal",
  primaryShade: { light: 6, dark: 6 },
  defaultRadius: "lg",
  defaultGradient: ctaGradient,
  // Bright filled colors (yellow, lime, ...) need black text to stay
  // readable — white-on-yellow was ~1.9:1 contrast. This computes the right
  // text color per background automatically, everywhere `variant="filled"`
  // is used (Badge, Button, etc.), instead of one-off overrides per color.
  autoContrast: true,
  colors: { signal, dark: graphite, alert },
  // Space Grotesk, loaded via Google Fonts in index.html — app-wide, not per-screen.
  fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  headings: { fontWeight: "700" },
  fontSizes: {
    xs: "0.8125rem",
    sm: "0.9375rem",
    md: "1.0625rem",
    lg: "1.1875rem",
    xl: "1.375rem",
  },
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.16)",
    sm: "0 2px 10px rgba(0, 0, 0, 0.18)",
    md: "0 8px 24px rgba(0, 0, 0, 0.22)",
    lg: "0 16px 36px rgba(0, 0, 0, 0.28)",
    xl: "0 24px 48px rgba(0, 0, 0, 0.34)",
  },
  components: {
    // radius: "xl" (32px) exceeds half the height of every button size we
    // use, so the browser clamps it to a true pill regardless of size —
    // every Button in the app, everywhere, from this one place.
    Button: {
      defaultProps: { ...bigControlSizes, variant: "gradient", radius: "xl" },
      // "lg" ships at 50px; every big CTA button in the app should be 48.
      styles: { root: { fontWeight: 700, letterSpacing: 0.2, height: 48 } },
    },
    ActionIcon: { defaultProps: bigControlSizes },
    TextInput: { defaultProps: bigControlSizes },
    PasswordInput: { defaultProps: bigControlSizes },
    NumberInput: { defaultProps: bigControlSizes },
    Textarea: { defaultProps: bigControlSizes },
    Select: { defaultProps: bigControlSizes },
    NativeSelect: { defaultProps: bigControlSizes },
    MultiSelect: { defaultProps: bigControlSizes },
    Checkbox: { defaultProps: { size: "md" } },
    Radio: { defaultProps: { size: "md" } },
    Switch: { defaultProps: { size: "md" } },
    Badge: { defaultProps: { radius: "xl", size: "lg" } },
    // Cards are the shared "tile" (dark.6, #1F1F1F) on the black page
    // background (dark.7) — one pair of tokens, used everywhere. Text inside
    // just uses Mantine's defaults (dimmed / no color prop): dark scheme's
    // text var is dark.0, which we've set to pure white, so it's already
    // correct without per-component overrides.
    Card: {
      defaultProps: { withBorder: false, shadow: "sm", radius: "xl", bg: "dark.6" },
    },
    // Full-screen/bottom-sheet overlays are capped to the same width as
    // AppScreen's frame (768 — see AppScreen.styles.ts) and centered, so they
    // don't stretch edge-to-edge past the app's own column on tablet.
    Modal: {
      defaultProps: { radius: "lg", shadow: "xl" },
      styles: { content: { maxWidth: 768, margin: "0 auto" } },
    },
    Drawer: {
      defaultProps: { radius: "lg", shadow: "xl" },
      styles: { content: { maxWidth: 768, margin: "0 auto" } },
    },
  },
});
