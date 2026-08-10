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

  const tasks = await getTasksByProjectAction(projectId);
  const sprints = await getSprintsByProjectAction(projectId);
  const workspaces = await getWorkspacesAction();

  const activeWorkspace = workspaces.find((w: IWorkspace) => w._id === project.workspaceId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      <Navbar user={user} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar workspaces={workspaces} activeWorkspace={activeWorkspace} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <KanbanBoard project={project} initialTasks={tasks} sprints={sprints} />
        </main>
      </div>
    </div>
  );
}
