import { redirect } from "next/navigation";
import AppShell from "@/components/shared/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import TeamClient from "./TeamClient";
import { getCurrentUserAction } from "@/actions/auth.actions";
import {
  getWorkspacesAction,
  getWorkspaceByIdAction,
  getWorkspaceActivityAction,
} from "@/actions/workspace.actions";

export default async function TeamPage() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const workspaces = await getWorkspacesAction();
  const activeWorkspace = workspaces[0] || null;

  const activeDetail = activeWorkspace ? await getWorkspaceByIdAction(activeWorkspace._id) : null;
  const initialActivity = activeWorkspace ? await getWorkspaceActivityAction(activeWorkspace._id) : [];

  return (
    <AppShell
      user={user}
      workspaces={workspaces}
      activeWorkspace={activeWorkspace || activeDetail}
    >
      <PageHeader
        eyebrow="People"
        title="Team & Workspace Access"
        description="Invite teammates, set their roles, and keep an eye on who changed what."
      />
      <TeamClient
        user={user}
        workspaces={workspaces}
        initialDetail={activeDetail}
        initialActivity={initialActivity}
      />
    </AppShell>
  );
}