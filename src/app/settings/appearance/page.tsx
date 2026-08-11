import { redirect } from "next/navigation";
import AppShell from "@/components/shared/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import AppearanceClient from "./AppearanceClient";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { getWorkspacesAction } from "@/actions/workspace.actions";

export default async function AppearancePage() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const workspaces = await getWorkspacesAction();
  const activeWorkspace = workspaces[0] || null;

  return (
    <AppShell user={user} workspaces={workspaces} activeWorkspace={activeWorkspace}>
      <PageHeader
        eyebrow="Settings"
        title="Appearance Settings"
        description="Manage how TaskFlow Pro looks on your device."
      />
      <AppearanceClient />
    </AppShell>
  );
}
