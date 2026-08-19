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
import { getDashboardStatsAction, getUserDashboardAction } from '@/actions/analytics.actions';
import { IWorkspace, IUpcomingTask, IActivityLog } from '@/types';
import Image from 'next/image';

export default async function DashboardPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect('/login');
  }

  const workspaces = await getWorkspacesAction();
  const stats = await getDashboardStatsAction();
  const dashboard = await getUserDashboardAction();

  const activeWorkspace = workspaces.length > 0 ? workspaces[0] : null;

  const priorityClass = (p: string) => {
    switch (p) {
      case 'Urgent': return 'badge-urgent';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const formatDue = (label?: string) => {
    if (!label) return '';
    const [y, m, d] = label.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} activeWorkspace={activeWorkspace} user={user} />

        <main className="flex-1 min-w-0 p-4 overflow-y-auto sm:p-6 lg:p-8">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-5 shadow-xl sm:p-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-0.5 text-[11px] font-semibold text-indigo-300 mb-2">
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                <span>Personalized Workspace</span>
              </div>
              <h1 className="text-xl font-extrabold text-white sm:text-2xl">Welcome back, {user.name}!</h1>
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
          <div className="grid grid-cols-2 gap-3 mt-5 sm:gap-4 sm:mt-6 lg:grid-cols-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-xs font-semibold">Active Workspaces</span>
                <Building2 className="h-4 w-4 shrink-0 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{stats?.activeWorkspaces || workspaces.length}</span>
                <span className="text-[10px] text-slate-500">Organizations</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-xs font-semibold">Active Projects</span>
                <FolderKanban className="h-4 w-4 shrink-0 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{stats?.activeProjects || 0}</span>
                <span className="text-[10px] text-slate-500">In Progress</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-xs font-semibold">Completed Tasks</span>
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400">{stats?.completedTasks || 0}</span>
                <span className="text-[10px] text-slate-500">out of {stats?.totalTasks || 0}</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-xs font-semibold">Due Today</span>
                <Clock className="h-4 w-4 shrink-0 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-400">{dashboard?.tasksDueToday ?? 0}</span>
                <span className="text-[10px] text-slate-500">Tasks</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-xs font-semibold">Completion Rate</span>
                <TrendingUp className="h-4 w-4 shrink-0 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-400">{stats?.completionRate || dashboard?.completionRate || 0}%</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+12% this week</span>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          {stats && <AnalyticsCharts stats={stats} />}

          {/* Upcoming Tasks + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 sm:mt-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Upcoming Deadlines</h2>
                <Link href="/calendar" className="text-xs font-semibold text-indigo-400 hover:underline">
                  View Calendar
                </Link>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                {dashboard?.upcomingTasks && dashboard.upcomingTasks.length > 0 ? (
                  <ul className="divide-y divide-slate-800/60">
                    {dashboard.upcomingTasks.map((t: IUpcomingTask) => (
                      <li key={t._id}>
                        <Link
                          href={`/projects/${t.projectId}`}
                          className="flex items-center justify-between gap-3 p-4 hover:bg-slate-900/60 transition group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityClass(t.priority)}`}>
                              {t.priority}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                                {t.title}
                              </p>
                              <p className="truncate text-[10px] text-slate-500">
                                {t.key ? `${t.key} · ` : ''}{t.projectName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs shrink-0">
                            {t.columnId !== 'done' && (
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                                {formatDue(t.dueLabel)}
                              </span>
                            )}
                            <ArrowRight className="hidden h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition sm:block" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="mx-auto h-8 w-8 text-slate-600" />
                    <p className="mt-2 text-xs text-slate-500">No upcoming deadlines. You&apos;re all caught up!</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Activity</h2>
              </div>

              <div className="glass-card rounded-2xl p-4 max-h-96 lg:max-h-112 overflow-y-auto">
                {dashboard?.recentActivity && dashboard.recentActivity.length > 0 ? (
                  <ul className="space-y-4">
                    {dashboard.recentActivity.map((log: IActivityLog) => (
                      <li key={log._id} className="flex gap-3">
                        <Image
                        width={20}
                        height={20}
                          src={log.actor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${log.actor?.name || 'User'}`}
                          alt="User"
                          className="h-7 w-7 rounded-full bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-300">
                            <span className="font-semibold text-slate-100">{log.actor?.name || 'Someone'}</span>{' '}
                            {log.action}
                          </p>
                          {log.project && (
                            <p className="text-[10px] text-slate-500">{log.project.name}</p>
                          )}
                          <p className="text-[10px] text-slate-600 mt-0.5">
                            {new Date(log.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">No recent activity.</p>
                )}
              </div>
            </div>
          </div>

          {/* Workspaces Grid */}
          <div className="mt-6 sm:mt-8">
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
                    <Image
                    width={20}
                    height={20}
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
