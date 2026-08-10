import React from 'react';
import { redirect } from 'next/navigation';
import { BarChart3, TrendingUp, CheckCircle, Clock, Users, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { getDashboardStatsAction } from '@/actions/analytics.actions';

export default async function ReportsPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect('/login');
  }

  const workspaces = await getWorkspacesAction();
  const stats = await getDashboardStatsAction();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} activeWorkspace={workspaces[0] || null} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="border-b border-slate-800 pb-5">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              <span>Analytics & Performance Reports</span>
            </h1>
            <p className="text-xs text-slate-400">Deep insights into team productivity, completion velocity, and priority allocation</p>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="glass-card rounded-2xl p-5">
              <span className="text-xs font-semibold text-slate-400">Project Completion Velocity</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{stats?.completionRate || 0}%</span>
                <span className="text-xs font-semibold text-emerald-400">Overall Rate</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <span className="text-xs font-semibold text-slate-400">Total Completed Tasks</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">{stats?.completedTasks || 0}</span>
                <span className="text-xs text-slate-500">out of {stats?.totalTasks || 0}</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <span className="text-xs font-semibold text-slate-400">Assigned Tasks</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-400">{stats?.assignedTasks || 0}</span>
                <span className="text-xs text-slate-500">Pending Actions</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          {stats && <AnalyticsCharts stats={stats} />}
        </main>
      </div>
    </div>
  );
}
