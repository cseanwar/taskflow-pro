import { redirect } from "next/navigation";
import AppShell from "@/components/shared/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import ProfileClient from "./ProfileClient";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { getWorkspacesAction } from "@/actions/workspace.actions";

export default async function ProfilePage() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const workspaces = await getWorkspacesAction();
  const activeWorkspace = workspaces[0] || null;

  return (
    <AppShell user={user} workspaces={workspaces} activeWorkspace={activeWorkspace}>
      <PageHeader
        eyebrow="Account"
        title="User Profile"
        description="Keep your personal details up to date, manage your password, and control how TaskFlow Pro reaches you."
      />
      <ProfileClient user={user} />
    </AppShell>
  );
}