import { redirect } from "next/navigation";
import AppShell from "@/components/shared/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import CollaborationCenter from "./CollaborationCenter";
import { getCurrentUserAction } from "@/actions/auth.actions";
import {
  getWorkspacesAction,
  getWorkspaceByIdAction,
  getWorkspaceActivityAction,
} from "@/actions/workspace.actions";
import { getProjectsByWorkspaceAction } from "@/actions/project.actions";

export default async function CollaborationPage() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const workspaces = await getWorkspacesAction();
  const activeWorkspace = workspaces[0] || null;

  if (!activeWorkspace) {
    return (
      <AppShell user={user} workspaces={workspaces}>
        <PageHeader
          eyebrow="Collaboration"
          title="Collaboration Center"
          description="Manage shared resources and monitor real-time activity."
        />
        <div className="rise rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
          <p className="text-sm font-bold text-slate-200">No workspace yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Create or join a workspace to see live team activity.
          </p>
        </div>
      </AppShell>
    );
  }

  const [workspace, activity, projects] = await Promise.all([
    getWorkspaceByIdAction(activeWorkspace._id),
    getWorkspaceActivityAction(activeWorkspace._id),
    getProjectsByWorkspaceAction(activeWorkspace._id),
  ]);

  return (
    <AppShell user={user} workspaces={workspaces} activeWorkspace={activeWorkspace}>
      <PageHeader
        eyebrow={activeWorkspace.name}
        title="Collaboration Center"
        description="Manage shared resources and monitor real-time activity."
      />
      <CollaborationCenter
        user={user}
        workspace={workspace || activeWorkspace}
        initialActivity={activity}
        projects={projects}
      />
    </AppShell>
  );
}
