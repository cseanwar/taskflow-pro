import { redirect } from "next/navigation";
import AppShell from "@/components/shared/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import AccessDenied from "@/components/shared/AccessDenied";
import ProjectSettingsClient from "./ProjectSettingsClient";
import { getCurrentUserAction, getAllUsersAction } from "@/actions/auth.actions";
import { getWorkspacesAction } from "@/actions/workspace.actions";
import { getProjectByIdAction } from "@/actions/project.actions";
import { projectPermissions } from "@/lib/permissions";
import { IWorkspace } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectSettingsPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const [workspaces, project] = await Promise.all([
    getWorkspacesAction(),
    getProjectByIdAction(id),
  ]);

  if (!project) redirect("/dashboard");

  const activeWorkspace = (workspaces as IWorkspace[]).find(w => w._id === project.workspaceId) || null;
  const permissions = projectPermissions(user, activeWorkspace);

  if (permissions.level < 3) {
    return (
      <AppShell user={user} workspaces={workspaces} activeWorkspace={activeWorkspace}>
        <PageHeader eyebrow="Project" title="Project Settings" />
        <AccessDenied required="Project Manager" />
      </AppShell>
    );
  }

  const allUsers = await getAllUsersAction();

  return (
    <AppShell user={user} workspaces={workspaces} activeWorkspace={activeWorkspace}>
      <PageHeader
        eyebrow="Project"
        title={`${project.name} — Settings`}
        description="Manage project configuration, membership, feature modules, and archival."
      />
      <ProjectSettingsClient user={user} project={project} workspaces={workspaces} allUsers={allUsers} />
    </AppShell>
  );
}