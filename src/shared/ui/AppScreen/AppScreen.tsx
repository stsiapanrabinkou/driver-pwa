import type { ReactNode } from "react";
import { Box } from "@mantine/core";
import { styles } from "./AppScreen.styles";

export interface AppScreenProps {
  /** Rendered above the scrollable area — sync bar, top bar, etc. */
  header?: ReactNode;
  children: ReactNode;
  /** Rendered below the scrollable area, outside the scroll — CTA, bottom nav. */
  footer?: ReactNode;
}

/**
 * Phone-width column, centered on wider viewports. Every flow screen in the
 * Driver PWA renders inside this so header/content/footer line up the same
 * way everywhere.
 */
export function AppScreen({ header, children, footer }: AppScreenProps) {
  return (
    <Box style={styles.page}>
      <Box style={styles.frame}>
        <Box style={styles.header}>{header}</Box>
        <Box style={styles.scrollArea}>{children}</Box>
        {footer}
      </Box>
    </Box>
  );
}

export default AppScreen;
