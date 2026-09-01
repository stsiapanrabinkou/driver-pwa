import { Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import {
  IconFileText, IconFileTextFilled, IconHome, IconHomeFilled,
  IconMessageCircle, IconMessageCircleFilled, IconTruck, IconTruckFilled,
  IconUser, IconUserFilled,
} from "@tabler/icons-react";
import { getStyles } from "./BottomNav.styles";

export type BottomNavKey = "home" | "shipments" | "messages" | "documents" | "profile";

const ITEMS: { key: BottomNavKey; label: string; path: string; icon: typeof IconHome; iconFilled: typeof IconHome }[] = [
  { key: "home", label: "Home", path: "/", icon: IconHome, iconFilled: IconHomeFilled },
  { key: "shipments", label: "Shipments", path: "/shipments", icon: IconTruck, iconFilled: IconTruckFilled },
  { key: "messages", label: "Messages", path: "/messages", icon: IconMessageCircle, iconFilled: IconMessageCircleFilled },
  { key: "documents", label: "Documents", path: "/documents", icon: IconFileText, iconFilled: IconFileTextFilled },
  { key: "profile", label: "Profile", path: "/profile", icon: IconUser, iconFilled: IconUserFilled },
];

export interface BottomNavProps {
  /** Omit on screens that aren't one of the 5 main tabs (e.g. Shipment
   * Details) — the nav still renders, just with nothing highlighted. */
  active?: BottomNavKey;
}

export function BottomNav({ active }: BottomNavProps) {
  const theme = useMantineTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.bar, display: "flex" }}>
      {ITEMS.map(({ key, label, path, icon: Icon, iconFilled: IconFilled }) => {
        const isActive = key === active;
        // Active = filled (solid, no stroke concept). Inactive = outline,
        // deliberately thinner than Tabler's default stroke (2) so the
        // resting state reads lighter next to the bold filled active icon.
        const IconComponent = isActive ? IconFilled : Icon;
        return (
          <UnstyledButton
            key={key}
            // Dynamic route tree => `to` is not literal-typed. Intentional.
            onClick={() => navigate({ to: path })}
            style={{ flex: 1, padding: "10px 4px" }}
          >
            <Stack align="center" gap={2}>
              <IconComponent
                size={22}
                stroke={isActive ? undefined : 1.5}
                color={isActive ? "var(--mantine-color-signal-6)" : "var(--mantine-color-dimmed)"}
              />
              <Text size="xs" fw={isActive ? 700 : 500} c={isActive ? "signal" : "dimmed"}>
                {label}
              </Text>
            </Stack>
          </UnstyledButton>
        );
      })}
    </div>
  );
}

export default BottomNav;
