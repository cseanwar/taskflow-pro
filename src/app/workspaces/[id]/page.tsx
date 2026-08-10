'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  FolderKanban, 
  Users, 
  Plus, 
  UserPlus, 
  Trash2, 
  Copy, 
  ArrowRight, 
  Loader2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CreateProjectModal from '@/components/modals/CreateProjectModal';
import InviteMemberModal from '@/components/modals/InviteMemberModal';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspaceByIdAction, removeWorkspaceMemberAction } from '@/actions/workspace.actions';
import { getProjectsByWorkspaceAction, duplicateProjectAction } from '@/actions/project.actions';
import { IWorkspace, IProject, IUser } from '@/types';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [user, setUser] = useState<IUser | null>(null);
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'members'>('projects');

  useEffect(() => {
    loadData();
  }, [workspaceId]);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await getCurrentUserAction();
    setUser(currentUser);

    const ws = await getWorkspaceByIdAction(workspaceId);
    setWorkspace(ws);

    const prjs = await getProjectsByWorkspaceAction(workspaceId);
    setProjects(prjs);
    setLoading(false);
  };

  const handleDuplicateProject = async (projectId: string) => {
    await duplicateProjectAction(projectId, workspaceId);
    loadData();
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!confirm('Remove member from workspace?')) return;
    await removeWorkspaceMemberAction(workspaceId, memberUserId);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} onOpenCreateProject={() => setIsProjectModalOpen(true)} />

      <div className="flex flex-1">
        <Sidebar workspaces={[workspace]} activeWorkspace={workspace} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Workspace Header */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={workspace.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${workspace.name}`}
                  alt={workspace.name}
                  className="h-16 w-16 rounded-2xl bg-slate-800 object-cover border border-slate-700 shadow-xl"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">{workspace.name}</h1>
                  <p className="mt-1 text-xs text-slate-400">{workspace.description || 'Organization Workspace'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  <UserPlus className="h-4 w-4 text-indigo-400" />
                  <span>Invite Team</span>
                </button>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 flex gap-2 border-t border-slate-800/80 pt-4">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === 'projects'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <FolderKanban className="h-4 w-4" />
                <span>Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === 'members'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Team Members ({workspace.members?.length || 1})</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Projects Grid */}
          {activeTab === 'projects' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <div key={p._id} className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-indigo-600/20 px-2.5 py-1 text-xs font-bold text-indigo-400">
                        {p.code}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicateProject(p._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                          title="Duplicate Project"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">{p.description || 'No project summary.'}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                      {p.category || 'Software'}
                    </span>
                    <Link
                      href={`/projects/${p._id}`}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Open Kanban</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
                  <FolderKanban className="mx-auto h-10 w-10 text-slate-500" />
                  <h3 className="mt-3 text-base font-bold text-slate-200">No Projects Created Yet</h3>
                  <p className="mt-1 text-xs text-slate-400">Create a project to start planning tasks on your Kanban board.</p>
                  <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Project</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Team Members Table */}
          {activeTab === 'members' && (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Member</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {workspace.members?.map((m: any) => (
                      <tr key={m.userId} className="text-slate-200">
                        <td className="py-3 flex items-center gap-3">
                          <img
                            src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name || m.userId}`}
                            alt={m.name || 'User'}
                            className="h-8 w-8 rounded-full bg-slate-800 object-cover"
                          />
                          <span className="font-semibold">{m.name || 'Workspace Member'}</span>
                        </td>
                        <td className="py-3 text-slate-400">{m.email || 'N/A'}</td>
                        <td className="py-3">
                          <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {m.role !== 'Workspace Owner' && (
                            <button
                              onClick={() => handleRemoveMember(m.userId)}
                              className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10"
                              title="Remove Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        workspaces={[workspace]}
        defaultWorkspaceId={workspace._id}
        onSuccess={loadData}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceId={workspace._id}
        onSuccess={loadData}
      />
    </div>
  );
}
