'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Filter, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { getProjectsByWorkspaceAction } from '@/actions/project.actions';
import { getTasksByProjectAction } from '@/actions/task.actions';
import { IUser, IWorkspace, IProject, ITask } from '@/types';

export default function CalendarPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await getCurrentUserAction();
    setUser(currentUser);

    const ws = await getWorkspacesAction();
    setWorkspaces(ws);

    let combinedProjects: IProject[] = [];
    let combinedTasks: ITask[] = [];

    for (const w of ws) {
      const prjs = await getProjectsByWorkspaceAction(w._id);
      combinedProjects.push(...prjs);
      for (const p of prjs) {
        const tks = await getTasksByProjectAction(p._id);
        combinedTasks.push(...tks);
      }
    }

    setProjects(combinedProjects);
    setAllTasks(combinedTasks);
    setLoading(false);
  };

  const filteredTasks = allTasks.filter(t => {
    if (!t.dueDate) return false;
    if (selectedProjectId === 'all') return true;
    return t.projectId === selectedProjectId;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} activeWorkspace={workspaces[0] || null} user={user} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-indigo-400" />
                <span>Calendar View</span>
              </h1>
              <p className="text-xs text-slate-400">Track project deadlines and scheduled task deliverables</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none"
              >
                <option value="all">All Projects</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-slate-200 mb-4">Upcoming Deadlines</h3>
                <div className="divide-y divide-slate-800/80">
                  {filteredTasks.map(t => (
                    <div key={t._id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${t.columnId === 'done' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                        <div>
                          <p className="font-bold text-white">{t.title}</p>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Priority: {t.priority}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-slate-400">
                        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                          {t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'No date'}
                        </span>
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                          {t.columnId.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No tasks with upcoming deadlines found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
