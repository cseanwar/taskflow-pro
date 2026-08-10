import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  FolderKanban, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Zap,
  Users
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { getDashboardStatsAction } from '@/actions/analytics.actions';
import { IWorkspace } from '@/types';

export default async function DashboardPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect('/login');
  }

  const workspaces = await getWorkspacesAction();
  const stats = await getDashboardStatsAction();

  const activeWorkspace = workspaces.length > 0 ? workspaces[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} activeWorkspace={activeWorkspace} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-0.5 text-[11px] font-semibold text-indigo-300 mb-2">
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                <span>Personalized Workspace</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">Welcome back, {user.name}!</h1>
              <p className="mt-1 text-xs text-slate-400">
                Here is your project overview and team activity breakdown.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/workspaces"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
              >
                <Plus className="h-4 w-4" />
                <span>Manage Workspaces</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Active Workspaces</span>
                <Building2 className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{stats?.activeWorkspaces || workspaces.length}</span>
                <span className="text-[10px] text-slate-500">Organizations</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Active Projects</span>
                <FolderKanban className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{stats?.activeProjects || 0}</span>
                <span className="text-[10px] text-slate-500">In Progress</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Completed Tasks</span>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400">{stats?.completedTasks || 0}</span>
                <span className="text-[10px] text-slate-500">out of {stats?.totalTasks || 0}</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Completion Rate</span>
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-400">{stats?.completionRate || 0}%</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+12% this week</span>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          {stats && <AnalyticsCharts stats={stats} />}

          {/* Workspaces Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Your Workspaces</h2>
              <Link href="/workspaces" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((w: IWorkspace) => (
                <Link
                  key={w._id}
                  href={`/workspaces/${w._id}`}
                  className="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={w.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${w.name}`}
                      alt={w.name}
                      className="h-10 w-10 rounded-xl bg-slate-800 object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {w.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{w.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span>{w.members?.length || 1} Members</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition" />
                  </div>
                </Link>
              ))}

              {workspaces.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-slate-500" />
                  <h3 className="mt-2 text-sm font-bold text-slate-300">No workspaces yet</h3>
                  <p className="mt-1 text-xs text-slate-500">Create your first workspace to start collaborating.</p>
                  <Link
                    href="/workspaces"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
