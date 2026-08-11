import { redirect } from "next/navigation";
import AppShell from "@/components/shared/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import NotificationsClient from "./NotificationsClient";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { getWorkspacesAction } from "@/actions/workspace.actions";
import { getNotificationsAction } from "@/actions/notification.actions";

export default async function NotificationsPage() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const [workspaces, notifications] = await Promise.all([
    getWorkspacesAction(),
    getNotificationsAction("all"),
  ]);
  const activeWorkspace = workspaces[0] || null;

  return (
    <AppShell user={user} workspaces={workspaces} activeWorkspace={activeWorkspace}>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Manage your alerts and updates. Task assignments, comments, and deadline reminders land here."
      />
      <NotificationsClient initialNotifications={notifications} user={user} />
    </AppShell>
  );
}