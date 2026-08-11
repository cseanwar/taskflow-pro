'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { IDashboardStats } from '@/types';

interface Props {
  stats: IDashboardStats;
}

export default function AnalyticsCharts({ stats }: Props) {
  const pieData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'Pending', value: stats.pendingTasks, color: '#6366f1' },
  ];

  const priorityData = stats.priorityStats.map(p => ({
    name: p.priority,
    Count: p.count,
  }));

  const statusData = stats.statusStats.map(s => ({
    name: s.status.replace('_', ' ').toUpperCase(),
    Tasks: s.count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Pie Chart: Task Completion */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-200 mb-1">Task Completion Overview</h3>
        <p className="text-xs text-slate-400 mb-4">Ratio of completed vs pending project tasks</p>
        <div className="h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Priority Distribution */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-200 mb-1">Task Distribution by Priority</h3>
        <p className="text-xs text-slate-400 mb-4">Breakdown of active tasks across priority levels</p>
        <div className="h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
              />
              <Bar dataKey="Count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
