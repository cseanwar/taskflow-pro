'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Plus, ArrowRight, Users, Shield, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CreateWorkspaceModal from '@/components/modals/CreateWorkspaceModal';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { IWorkspace, IUser } from '@/types';

export default function WorkspacesPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await getCurrentUserAction();
    setUser(currentUser);
    const ws = await getWorkspacesAction();
    setWorkspaces(ws);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} onOpenCreateWorkspace={() => setIsCreateOpen(true)} />

      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} user={user} onOpenCreateWorkspace={() => setIsCreateOpen(true)} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-xl font-bold text-white">Workspaces</h1>
              <p className="text-xs text-slate-400">Manage your organization workspaces and team members</p>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {workspaces.map(w => (
                <div key={w._id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <img
                        src={w.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${w.name}`}
                        alt={w.name}
                        className="h-12 w-12 rounded-xl bg-slate-800 object-cover border border-slate-700"
                      />
                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                        {w.members?.length || 1} Members
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-white">{w.name}</h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">{w.description || 'No description provided.'}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <span className="text-[11px] text-slate-500">Slug: /{w.slug}</span>
                    <Link
                      href={`/workspaces/${w._id}`}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}

              {workspaces.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
                  <Building2 className="mx-auto h-10 w-10 text-slate-500" />
                  <h3 className="mt-3 text-base font-bold text-slate-200">No Workspaces Found</h3>
                  <p className="mt-1 text-xs text-slate-400">Get started by creating your team workspace.</p>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <CreateWorkspaceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
