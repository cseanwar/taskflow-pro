'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  FolderOpen,
  Target,
} from 'lucide-react';
import { IReportProject, IProjectOverview, IDashboardStats } from '@/types';
import { getProjectOverviewAction } from '@/actions/analytics.actions';
import VelocityChart from './VelocityChart';
import TeamProductivityTable from './TeamProductivityTable';
import WorkloadCapacity from './WorkloadCapacity';

interface Props {
  projects: IReportProject[];
  stats: IDashboardStats | null;
}

const DONUT_COLORS = ['#34d399', '#6366f1'];

export default function ReportsView({ projects, stats }: Props) {
  const [selectedId, setSelectedId] = useState<string>(projects[0]?._id || '');
  const [overview, setOverview] = useState<IProjectOverview | null>(null);
  const [loadedId, setLoadedId] = useState<string>('');

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    getProjectOverviewAction(selectedId)
      .then(o => {
        if (!cancelled) {
          setOverview(o);
          setLoadedId(selectedId);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const donutData = overview
    ? [
        { name: 'Completed', value: overview.completedTasks },
        { name: 'Pending', value: overview.openTasks },
      ]
    : [];

  const metricCards = [
    {
      label: 'Completion Rate',
      value: overview ? `${overview.completionRate}%` : `${stats?.completionRate || 0}%`,
      sub: 'tasks done',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      label: 'Open Tasks',
      value: String(overview?.openTasks ?? stats?.pendingTasks ?? 0),
      sub: 'in progress / queued',
      icon: FolderOpen,
      color: 'text-indigo-400',
    },
    {
      label: 'Cycle Time',
      value: overview ? `${overview.cycleTimeDays}d` : '—',
      sub: 'avg. creation → done',
      icon: Clock,
      color: 'text-sky-400',
    },
    {
      label: 'Due Within 7 Days',
      value: String(overview?.tasksDueSoon ?? '—'),
      sub: overview?.activeSprint ? `sprint: ${overview.activeSprint.name}` : 'no active sprint',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
  ];

  return (
    <div>
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {metricCards.map(card => (
          <div key={card.label} className="glass-card rounded-2xl p-5">
            <span className="text-xs font-semibold text-slate-400">{card.label}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${card.color}`}>{card.value}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Project Selector */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Target className="h-4 w-4 text-indigo-400" />
        <label className="text-xs font-semibold text-slate-300">Project</label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none"
        >
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.code}) · {p.workspaceName}
            </option>
          ))}
        </select>
        {loadedId === selectedId && overview && (
          <span className="rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1 text-[11px] text-slate-400">
            {overview.totalTasks} tasks · {overview.completedTasks} completed
          </span>
        )}
      </div>

      {(loadedId !== selectedId || !overview) && (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-slate-800 py-16 text-center">
          <BarChart3 className="h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm font-semibold text-slate-400">Select a project to view its analytics</p>
        </div>
      )}

      {overview && loadedId === selectedId && (
        <>
          {/* Velocity + Completion Donut */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200">Sprint Velocity</h3>
              </div>
              <p className="mb-4 mt-0.5 text-xs text-slate-400">Committed vs completed tasks per sprint</p>
              <VelocityChart velocity={overview.velocity} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-200">Completion</h3>
              <p className="mt-0.5 mb-4 text-xs text-slate-400">
                {overview.totalTasks === 0 ? 'No tasks yet' : `${overview.completionRate}% of project done`}
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Team Productivity */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Team Productivity</h3>
                <p className="mt-0.5 text-xs text-slate-400">Per-member completion split by features vs bugs. Click a row for details.</p>
              </div>
              {overview.teamProductivity.length > 0 && (
                <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
                  {overview.teamProductivity.reduce((sum, m) => sum + m.totalCompleted, 0)} done
                </span>
              )}
            </div>
            <TeamProductivityTable members={overview.teamProductivity} workload={overview.teamWorkload} />
          </div>

          {/* Workload & Capacity */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Team Workload & Capacity</h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Open tasks per column (heatmap) and allocation vs capacity ({overview.teamWorkload[0]?.capacity || 10} open = 100%).
                </p>
              </div>
            </div>
            <WorkloadCapacity workload={overview.teamWorkload} />
          </div>
        </>
      )}
    </div>
  );
}
