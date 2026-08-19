import React from 'react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getProjectByIdAction } from '@/actions/project.actions';
import { getTasksByProjectAction } from '@/actions/task.actions';
import { getSprintsByProjectAction } from '@/actions/sprint.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { effectiveWorkspaceLevel, projectPermissions } from '@/lib/permissions';
import { IWorkspace } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectKanbanPage({ params }: Props) {
  const { id: projectId } = await params;

  const user = await getCurrentUserAction();
  if (!user) {
    redirect('/login');
  }

  const project = await getProjectByIdAction(projectId);
  if (!project) {
    redirect('/dashboard');
  }

  const [tasks, sprints, workspaces] = await Promise.all([
    getTasksByProjectAction(projectId),
    getSprintsByProjectAction(projectId),
    getWorkspacesAction(),
  ]);

  const activeWorkspace = workspaces.find((w: IWorkspace) => w._id === project.workspaceId) || null;
  const workspaceLevel = effectiveWorkspaceLevel(user, activeWorkspace);

  // Guests, team members, and members of the project's workspace can open the
  // board read-only. Non-members (and non-admins) are sent away.
  if (workspaceLevel < 1) {
    redirect('/dashboard');
  }

  const permissions = projectPermissions(user, activeWorkspace);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col h-screen overflow-hidden">
      <Navbar user={user} isGuest={permissions.isGuest} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar workspaces={workspaces} activeWorkspace={activeWorkspace} user={user} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <KanbanBoard
            project={project}
            initialTasks={tasks}
            sprints={sprints}
            permissions={permissions}
          />
        </main>
      </div>
    </div>
  );
}
