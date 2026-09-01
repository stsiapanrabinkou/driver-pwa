import { AppScreen } from "../../shared/ui/AppScreen/AppScreen";
import { BottomNav } from "../../shared/ui/BottomNav/BottomNav";
import { PlaceholderScreen } from "../../shared/ui/PlaceholderScreen/PlaceholderScreen";
import { SyncStatusBar } from "../../shared/ui/SyncStatusBar/SyncStatusBar";
import { mockPendingSync } from "../../shared/ui/SyncStatusBar/mockPendingSync";

export function ProfileScreen() {
  return (
    <AppScreen
      header={<SyncStatusBar pendingItems={mockPendingSync} onRetry={() => console.log("retry sync")} />}
      footer={<BottomNav active="profile" />}
    >
      <PlaceholderScreen label="Profile" />
    </AppScreen>
  );
}

export default ProfileScreen;
