import React from 'react';
import { redirect } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ReportsView from '@/components/reports/ReportsView';
import { getCurrentUserAction } from '@/actions/auth.actions';
import { getWorkspacesAction } from '@/actions/workspace.actions';
import { getDashboardStatsAction } from '@/actions/analytics.actions';
import { getReportProjectsAction } from '@/actions/analytics.actions';

export default async function ReportsPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect('/login');
  }

  const [workspaces, stats, projects] = await Promise.all([
    getWorkspacesAction(),
    getDashboardStatsAction(),
    getReportProjectsAction(),
  ]);

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
            <p className="text-xs text-slate-400">
              Sprint velocity, member productivity, and workload capacity per project
            </p>
          </div>

          <ReportsView projects={projects} stats={stats} />
        </main>
      </div>
    </div>
  );
}